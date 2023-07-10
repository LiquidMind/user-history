// Робочий код

// const { google } = require("googleapis");
// const createPlaylist = require("./createPlaylist");
// const addVideoToPlaylist = require("./addVideoToPlaylist");
// const { db } = require("../../../model/dbConnection");
// const updateTopXMostViewedPlaylist = require("../../../playlists/playlistUpdateDb");

// const arrOptionPlaylist = require("../../arrayPlaylist.json");

// function getOrCreatePlaylist(auth, resId) {
//   const service = google.youtube("v3");

//   service.playlists.list(
//     {
//       auth: auth,
//       part: "snippet",
//       mine: true,
//     },
//     async (err, response) => {
//       if (err) {
//         console.log("getOrCreatePlaylist: the API returned an error: " + err);
//         return;
//       }

//       for (let i = 0; i < arrOptionPlaylist.length; i++) {
//         const resObj = arrOptionPlaylist[i];

//         const playlistName = resObj.namePlaylist;
//         const description = resObj.description;

//         const playlists = response.data.items;
//         const playlist = playlists.find(
//           (p) => p.snippet.title === `${playlistName}`
//         );

//         console.log(!!playlist);
//         console.log(`ID_USER: ${resId}`);

//         const sqlQuery = `SELECT videos_all.id, videos_all.${resObj.nameColumn}
//           FROM videos_all
//           WHERE videos_all.id IN (
//             SELECT videos_user_${resId}.id FROM videos_user_${resId}
//           )
//           ORDER BY videos_all.${resObj.nameColumn} DESC
//           LIMIT 5;
//         `;

//         try {
//           const result = await new Promise((resolve, reject) => {
//             db.query(sqlQuery, (err, result) => {
//               if (err) {
//                 reject(err);
//               } else {
//                 resolve(result);
//               }
//             });
//           });

//           const videoIds = result.map((resObj) => resObj.id);
//           console.log(videoIds);

//           if (playlist) {
//             console.log("Playlist already exists with id: " + playlist.id);
//             await addVideoToPlaylist(auth, playlist.id, videoIds);
//             console.log("Added videos to playlist.");
//           } else {
//             await createPlaylist(auth, videoIds, playlistName, description);
//             console.log("Created playlist and added videos.");
//           }
//         } catch (error) {
//           console.log(error);
//         }
//       }
//     }
//   );
// }

// module.exports = getOrCreatePlaylist;

const { google } = require("googleapis"); // Підключення Google API
const createPlaylist = require("./createPlaylist"); // Функція для створення плейлисту
const addVideoToPlaylist = require("./addVideoToPlaylist"); // Функція для додавання відео до плейлисту
const { db } = require("../../../model/dbConnection"); // Підключення до бази даних

const arrOptionPlaylist = require("../../arrayPlaylist.json"); // Масив даних для плейлистів

// Функція getOrCreatePlaylist - отримує або створює плейлист
function getOrCreatePlaylist(auth, resId) {
  const service = google.youtube("v3"); // Ініціалізація Google YouTube API v3

  service.playlists.list(
    {
      auth: auth, // Аутентифікація
      part: "snippet", // Частина відповіді API
      mine: true, // Отримуємо лише власні плейлисти
    },
    async (err, response) => {
      // Асинхронний callback
      if (err) {
        // Якщо сталася помилка
        console.log("getOrCreatePlaylist: the API returned an error: " + err); // Виводимо повідомлення про помилку
        return; // Виходимо з функції
      }

      // Проходимося по всіх елементах масиву даних для плейлистів
      for (let i = 0; i < arrOptionPlaylist.length; i++) {
        const resObj = arrOptionPlaylist[i]; // Отримуємо поточний об'єкт

        const playlistName = resObj.namePlaylist; // Назва плейлисту
        const description = resObj.description; // Опис плейлисту

        const playlists = response.data.items; // Отримуємо масив плейлистів
        const playlist = playlists.find(
          (p) => p.snippet.title === `${playlistName}` // Шукаємо плейлист з відповідним ім'ям
        );

        console.log(!!playlist); // Показуємо, чи знайдений плейлист існує
        console.log(`ID_USER: ${resId}`); // Виводимо ID користувача

        // Створюємо SQL запит для отримання відео
        const sqlQuery = `SELECT videos_all.id, videos_all.${resObj.nameColumn}
          FROM videos_all
          WHERE videos_all.id IN (
            SELECT videos_user_${resId}.id FROM videos_user_${resId}
          )
          ORDER BY videos_all.${resObj.nameColumn} DESC
          LIMIT 5;
        `;

        try {
          // Виконуємо SQL запит і отримуємо результат
          const result = await new Promise((resolve, reject) => {
            db.query(sqlQuery, (err, result) => {
              if (err) {
                reject(err); // Відхилення promise, якщо є помилка
              } else {
                resolve(result); // Повертаємо результат, якщо все ОК
              }
            });
          });

          const videoIds = result.map((resObj) => resObj.id); // Масив ID відео
          console.log(videoIds); // Виводимо масив ID відео

          if (playlist) {
            // Якщо плейлист знайдений
            console.log("Playlist already exists with id: " + playlist.id); // Виводимо ідентифікатор плейлисту
            await addVideoToPlaylist(auth, playlist.id, videoIds); // Додаємо відео до плейлисту
            console.log("Added videos to playlist."); // Виводимо повідомлення про додавання відео
          } else {
            // Якщо плейлисту не існує
            await createPlaylist(auth, videoIds, playlistName, description); // Створюємо плейлист і додаємо відео
            console.log("Created playlist and added videos."); // Виводимо повідомлення про створення плейлисту
          }
        } catch (error) {
          // Якщо сталася помилка
          console.log(error); // Виводимо повідомлення про помилку
        }
      }
    }
  );
}

module.exports = getOrCreatePlaylist; // Експортуємо функцію getOrCreatePlaylist
