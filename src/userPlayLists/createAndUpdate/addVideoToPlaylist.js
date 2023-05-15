const { google } = require("googleapis");

function addVideoToPlaylist(auth, playlistId, videoId) {
  const service = google.youtube("v3");

  service.playlistItems.list(
    {
      auth: auth,
      part: "snippet",
      playlistId: playlistId,
      videoId: videoId,
    },
    function (err, response) {
      if (err) {
        console.log("addVideoToPlaylist: the API returned an error: " + err);
        return;
      }

      const items = response.data.items;
      const item = items.find((i) => i.snippet.resourceId.videoId === videoId);

      if (!item) {
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
              console.log(
                "addVideoToPlaylist: the API returned an error: " + err
              );
              return;
            }

            console.log("Added video to playlist.");
          }
        );
      } else {
        console.log("Video already exists in the playlist.");
      }
    }
  );
}

module.exports = addVideoToPlaylist;
