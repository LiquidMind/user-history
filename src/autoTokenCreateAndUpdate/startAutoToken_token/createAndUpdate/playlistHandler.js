const { google } = require("googleapis");
const createPlaylist = require("./createPlaylist");
const addVideoToPlaylist = require("./addVideoToPlaylist");
const { db } = require("../../../model/dbConnection");

function getOrCreatePlaylist(auth, resId) {
  const service = google.youtube("v3");

  service.playlists.list(
    {
      auth: auth,
      part: "snippet",
      mine: true,
    },
    (err, response) => {
      if (err) {
        console.log("getOrCreatePlaylist: the API returned an error: " + err);
        return;
      }

      //// ПОВИНЕНІ ПРИЙТИ ДАНІ СТВОРЕНОГО МАСИВУ ОБЄКТІВ ЯКІ БУДЕ ВПИСУВАТИ ТА КОЖНИМ ЦИКЛОМ СТВОРЮВАТИ НОВИЙЦ ПЛЕЙЛІСТ ПО ОБЄКТАХ

      const playlistName = "Top Viewes";

      const playlists = response.data.items;
      const playlist = playlists.find(
        (p) => p.snippet.title === `${playlistName}`
      );

      console.log(!!playlist);
      console.log(`ID_USER: ${resId}`);

      const sqlQuery = `SELECT videos_all.id, videos_all.viewes
        FROM videos_all
        WHERE videos_all.id IN (
          SELECT videos_user_${resId}.id FROM videos_user_${resId}
        )
        ORDER BY videos_all.viewes DESC
        LIMIT 5;
      `;
      //       const sqlQuery = `SELECT videos_all.id, videos_all.lengthVideo
      //   FROM videos_all
      //   WHERE videos_all.id IN (
      //     SELECT videos_user_${resId}.id FROM videos_user_${resId}
      //   )
      //   AND videos_all.language = 'ua'
      //   ORDER BY videos_all.lengthVideo DESC
      //   LIMIT 5;
      // `;

      db.query(sqlQuery, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }

        const videoIds = result.map((resObj) => resObj.id);
        console.log(videoIds);

        if (playlist) {
          console.log("Playlist already exists with id: " + playlist.id);
          addVideoToPlaylist(auth, playlist.id, videoIds)
            .then(() => {
              console.log("Added videos to playlist.");
            })
            .catch((err) => {
              console.log("Error adding videos to playlist: " + err);
            });
        } else {
          createPlaylist(auth, videoIds, playlistName)
            .then(() => {
              console.log("Created playlist and added videos.");
            })
            .catch((err) => {
              console.log("Error creating playlist and adding videos: " + err);
            });
        }
      });
    }
  );
}

module.exports = getOrCreatePlaylist;
