const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

function createPlaylist(auth) {
  const service = google.youtube("v3");
  service.playlists.insert(
    {
      auth: auth,
      part: "snippet,status",
      requestBody: {
        snippet: {
          title: "TEST_PLAYLIST",
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
      addVideoToPlaylist(auth, response.data.id, "M0ICeuJ4Vns");
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
        console.log("TaddVideoToPlaylis: the API returned an error: " + err);

        return;
      }

      console.log("Added video to playlist.");
    }
  );
}

// createPlaylist();
