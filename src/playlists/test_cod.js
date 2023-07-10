// const mysql = require("mysql2/promise");
// require("dotenv").config();

// const { HOST, USER, DATABASE, PASSWORD } = process.env;

// async function updatePlaylist(topX, key, orderQuery, title, description) {
//   const connection = await mysql.createConnection({
//     host: HOST,
//     user: "root",
//     database: DATABASE,
//     password: PASSWORD,
//     charset: "utf8mb4",
//   });

//   const [videos] = await connection.execute(
//     `SELECT id FROM videos_all ${orderQuery} LIMIT ${topX}`
//   );

//   const [playlists] = await connection.execute(
//     "SELECT playlist_id FROM playlists WHERE user_id = 0 AND key_playlist = ?",
//     [key]
//   );

//   let playlistId;

//   if (playlists.length > 0) {
//     playlistId = playlists[0].playlist_id;
//   } else {
//     const [result] = await connection.execute(
//       "INSERT INTO playlists (user_id, title, description, key_playlist) VALUES (0, ?, ?, ?)",
//       [title, description, key]
//     );

//     playlistId = result.insertId;
//   }

//   await connection.execute(
//     "UPDATE playlists_content SET deleted_at = CURRENT_TIMESTAMP WHERE playlist_id = ?",
//     [playlistId]
//   );

//   for (let i = 0; i < videos.length; i++) {
//     const videoId = videos[i].id;

//     await connection.execute(
//       "INSERT INTO playlists_content (playlist_id, order_num, video_id) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE video_id = VALUES(video_id), deleted_at = NULL",
//       [playlistId, i + 1, videoId]
//     );

//     const [lastUpdate] = await connection.execute(
//       "SELECT new_video_id, new_order FROM playlists_content_updates WHERE playlist_id = ? AND new_order = ? ORDER BY updated_at DESC LIMIT 1",
//       [playlistId, i + 1]
//     );

//     let oldVideoId = null;
//     let oldOrder = null;

//     if (lastUpdate.length > 0) {
//       oldVideoId = lastUpdate[0].new_video_id;
//       oldOrder = lastUpdate[0].new_order;
//     }

//     await connection.execute(
//       "INSERT INTO playlists_content_updates (playlist_id, old_order, new_order, old_video_id, new_video_id) VALUES (?, ?, ?, ?, ?)",
//       [playlistId, oldOrder, i + 1, oldVideoId, videoId]
//     );
//   }

//   await connection.execute(
//     "UPDATE playlists SET updated_at = CURRENT_TIMESTAMP WHERE playlist_id = ?",
//     [playlistId]
//   );

//   await connection.execute(
//     "INSERT INTO playlists_updates (playlist_id, new_title, new_description) VALUES (?, ?, ?)",
//     [playlistId, title, description]
//   );

//   await connection.end();
// }

// async function main() {
//   const topX = 3;

//   await updatePlaylist(
//     topX,
//     `TOP_${topX}_MOST_VIEWED_DAILY`,
//     `ORDER BY viewes ASC`,
//     `Top ${topX} Most Viewed Daily Videos`,
//     `This playlist contains the top ${topX} most viewed videos on a daily basis.`
//   );

//   await updatePlaylist(
//     topX,
//     `TOP_${topX}_MOST_VIEWED`,
//     `ORDER BY okLike DESC`,
//     `Top ${topX} Most Viewed Videos`,
//     `This playlist contains the top ${topX} most viewed videos.`
//   );
// }

// main().catch(console.error);
