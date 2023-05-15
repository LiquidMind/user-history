const { google } = require("googleapis");
const createPlaylist = require("./createPlaylist");
const addVideoToPlaylist = require("./addVideoToPlaylist");

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
      const playlist = playlists.find(
        (p) => p.snippet.title === "NEW PLAYLIST"
      );

      if (playlist) {
        console.log("Playlist already exists with id: " + playlist.id);
        addVideoToPlaylist(auth, playlist.id, "7iUw0aafvAU");
      } else {
        createPlaylist(auth);
      }
    }
  );
}

module.exports = getOrCreatePlaylist;
