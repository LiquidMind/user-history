const { google } = require("googleapis");
const createPlaylist = require("./createPlaylist");
const addVideoToPlaylist = require("./addVideoToPlaylist");
const { db } = require("../../../model/dbConnection");

function getOrCreatePlaylist(auth) {
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

      const playlists = response.data.items;
      const playlist = playlists.find((p) => p.snippet.title === "Top Views");

      console.log(!!playlist);

      const sqlQuery = `SELECT videos_all.id, videos_all.viewes
        FROM videos_all
        WHERE videos_all.id IN (
          SELECT videos_user_3.id FROM videos_user_3
        )
        ORDER BY videos_all.viewes DESC
        LIMIT 6;
      `;

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
          createPlaylist(auth, videoIds)
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
