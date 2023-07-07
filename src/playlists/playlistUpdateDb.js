const mysql = require("mysql2/promise");
require("dotenv").config();

const { HOST, USER, DATABASE, PASSWORD } = process.env;

async function updateTopXMostViewedPlaylist(topX) {
  // Встановлюємо з'єднання з базою даних
  const connection = await mysql.createConnection({
    host: HOST,
    user: "root",
    database: DATABASE,
    password: PASSWORD,
    charset: "utf8mb4",
  });

  // Крок 1: Отримуємо TOP X найбільш переглянутих відео
  // Виконуємо запит SELECT, щоб отримати топ X відео, відсортованих за кількістю переглядів
  const [videos] = await connection.execute(
    `SELECT id FROM videos_all ORDER BY viewes DESC LIMIT ${topX}`
  );

  // Крок 2: Перевіряємо, чи вже існує плейлист
  // Виконуємо запит SELECT, щоб отримати плейлист з конкретним key_playlist
  const [playlists] = await connection.execute(
    "SELECT playlist_id FROM playlists WHERE user_id = 0 AND key_playlist = ?",
    [`TOP_${topX}_MOST_VIEWED`]
  );

  let playlistId;

  if (playlists.length > 0) {
    // Якщо плейлист уже існує, отримуємо його ID
    playlistId = playlists[0].playlist_id;
  } else {
    // Якщо плейлиста немає, створюємо його
    // Виконуємо запит INSERT, щоб створити новий плейлист
    const [result] = await connection.execute(
      "INSERT INTO playlists (user_id, title, description, key_playlist) VALUES (0, ?, ?, ?)",
      [`TOP_${topX}_MOST_VIEWED`, "Опис плейлисту", "Ключове слово плейлисту"]
    );

    // Отримуємо ID новоствореного плейлиста
    playlistId = result.insertId;
  }

  // Крок 3: Оновлюємо вміст плейлиста
  // Спочатку позначаємо всі існуючі відео в плейлисті як видалені
  // Виконуємо запит UPDATE, щоб встановити deleted_at в поточний часовий штамп для всіх відео в плейлисті
  await connection.execute(
    "UPDATE playlists_content SET deleted_at = CURRENT_TIMESTAMP WHERE playlist_id = ?",
    [playlistId]
  );

  // Потім додаємо нові відео до плейлиста
  // Проходимо по відео в циклі та виконуємо запит INSERT для кожного відео
  for (let i = 0; i < videos.length; i++) {
    const videoId = videos[i].id;
    await connection.execute(
      "INSERT INTO playlists_content (playlist_id, order_num, video_id) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE video_id = VALUES(video_id), deleted_at = NULL",
      [playlistId, i + 1, videoId]
    );

    // Виконуємо запит INSERT, щоб додати запис до playlists_content_updates
    await connection.execute(
      "INSERT INTO playlists_content_updates (playlist_id, new_order, new_video_id) VALUES (?, ?, ?)",
      [playlistId, i + 1, videoId]
    );
  }

  // Крок 4: Оновлюємо часовий штамп updated_at плейлиста
  // Виконуємо запит UPDATE, щоб встановити updated_at в поточний часовий штамп для плейлиста
  await connection.execute(
    "UPDATE playlists SET updated_at = CURRENT_TIMESTAMP WHERE playlist_id = ?",
    [playlistId]
  );

  // Виконуємо запит INSERT, щоб додати запис до playlists_updates
  await connection.execute(
    "INSERT INTO playlists_updates (playlist_id, new_title, new_description) VALUES (?, ?, ?)",
    [
      playlistId,
      `Top ${topX} Most Viewed Videos`,
      `This playlist contains the top ${topX} most viewed videos.`,
    ]
  );

  // Закриваємо з'єднання з базою даних
  await connection.end();
}

// Визначаємо кількість топ відео для отримання
const topX = 10;

// Викликаємо функцію для оновлення плейлиста та обробляємо будь-які помилки
updateTopXMostViewedPlaylist(topX).catch(console.error);
