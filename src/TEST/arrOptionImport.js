const { google } = require("googleapis");
const createPlaylist = require("./createPlaylist");
const addVideoToPlaylist = require("./addVideoToPlaylist");
const { db } = require("../../../model/dbConnection");

const arrOptionPlaylist = require("../../arrayPlaylist.json");

function getOrCreatePlaylist(auth, resId) {
  const service = google.youtube("v3");

  service.playlists.list(
    {
      auth: auth,
      part: "snippet",
      mine: true,
    },
    async (err, response) => {
      if (err) {
        console.log("getOrCreatePlaylist: the API returned an error: " + err);
        return;
      }

      for (let i = 0; i < arrOptionPlaylist.length; i++) {
        const resObj = arrOptionPlaylist[i];

        const playlistName = resObj.namePlaylist;

        const playlists = response.data.items;
        const playlist = playlists.find(
          (p) => p.snippet.title === `${playlistName}`
        );

        console.log(!!playlist);
        console.log(`ID_USER: ${resId}`);

        const sqlQuery = `SELECT videos_all.id, videos_all.${resObj.nameColumn}
          FROM videos_all
          WHERE videos_all.id IN (
            SELECT videos_user_${resId}.id FROM videos_user_${resId}
          )
          ORDER BY videos_all.${resObj.nameColumn} DESC
          LIMIT 5;
        `;

        try {
          const result = await new Promise((resolve, reject) => {
            db.query(sqlQuery, (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            });
          });

          const videoIds = result.map((resObj) => resObj.id);
          console.log(videoIds);

          if (playlist) {
            console.log("Playlist already exists with id: " + playlist.id);
            await addVideoToPlaylist(auth, playlist.id, videoIds);
            console.log("Added videos to playlist.");
          } else {
            await createPlaylist(auth, videoIds, playlistName);
            console.log("Created playlist and added videos.");
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  );
}
