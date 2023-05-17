const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

function tokenClient(token) {
  const { access_token, refresh_token, token_type, expiry_date } = token;

  const oauth2Client = new OAuth2();
  oauth2Client.setCredentials({
    access_token: access_token,
    refresh_token: refresh_token,
    token_type: token_type,
    expiry_date: expiry_date,
  });
  getOrCreatePlaylist(oauth2Client);
}

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
      const playlist = playlists.find((p) => p.snippet.title === "FIRST");

      if (playlist) {
        console.log("Playlist already exists with id: " + playlist.id);
        addVideoToPlaylist(auth, playlist.id, "-OP9WUD4WcA");
      } else {
        createPlaylist(auth);
      }
    }
  );
}

function createPlaylist(auth) {
  const service = google.youtube("v3");
  service.playlists.insert(
    {
      auth: auth,
      part: "snippet,status",
      requestBody: {
        snippet: {
          title: "FIRST",
          description: "This is a test playlist created by the YouTube API v3",
        },
        status: {
          privacyStatus: "private",
        },
      },
    },
    function (err, response) {
      if (err) {
        console.log("createPlaylist: the API returned an error: " + err);
        return;
      }

      console.log("Created playlist with id: " + response.data.id);
      addVideoToPlaylist(auth, response.data.id, "yS_s0wAB9yg");
    }
  );
}

function addVideoToPlaylist(auth, playlistId, videoId) {
  const service = google.youtube("v3");
  service.playlistItems.insert(
    {
      auth: auth,
      part: "snippet",
      requestBody: {
        snippet: {
          playlistId: playlistId,
          resourceId: {
            kind: "youtube#video",
            videoId: videoId,
          },
        },
      },
    },
    function (err, response) {
      if (err) {
        console.log("addVideoToPlaylist: the API returned an error: " + err);
        return;
      }

      console.log("Added video to playlist.");
    }
  );
}

module.exports = tokenClient;
