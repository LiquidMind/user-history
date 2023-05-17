// const { google } = require("googleapis");

// function addVideoToPlaylist(auth, playlistId, videoId) {
//   const service = google.youtube("v3");

//   service.playlistItems.list(
//     {
//       auth: auth,
//       part: "snippet",
//       playlistId: playlistId,
//       videoId: videoId,
//     },
//     function (err, response) {
//       if (err) {
//         console.log("addVideoToPlaylist: the API returned an error: " + err);
//         return;
//       }

//       const items = response.data.items;
//       const item = items.find((i) => i.snippet.resourceId.videoId === videoId);

//       if (!item) {
//         service.playlistItems.insert(
//           {
//             auth: auth,
//             part: "snippet",
//             requestBody: {
//               snippet: {
//                 playlistId: playlistId,
//                 resourceId: {
//                   kind: "youtube#video",
//                   videoId: videoId,
//                 },
//               },
//             },
//           },
//           function (err, response) {
//             if (err) {
//               console.log(
//                 "addVideoToPlaylist: the API returned an error: " + err
//               );
//               return;
//             }

//             console.log("Added video to playlist.");
//           }
//         );
//       } else {
//         console.log("Video already exists in the playlist.");
//       }
//     }
//   );
// }

// module.exports = addVideoToPlaylist;
// Add Array cicle

const { google } = require("googleapis");

async function addVideoToPlaylist(auth, playlistId, videoIds) {
  const service = google.youtube("v3");

  try {
    for (const videoId of videoIds) {
      const response = await service.playlistItems.list({
        auth: auth,
        part: "snippet",
        playlistId: playlistId,
        videoId: videoId,
      });

      const items = response.data.items;
      const videoExists = items.some(
        (item) => item.snippet.resourceId.videoId === videoId
      );

      if (!videoExists) {
        await service.playlistItems.insert({
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
        });

        console.log("Added video to playlist.");
      } else {
        console.log("Video already exists in the playlist.");
      }
    }

    console.log("Added videos to playlist.");
  } catch (err) {
    console.log("addVideoToPlaylist: the API returned an error: " + err);
    throw err;
  }
}

module.exports = addVideoToPlaylist;
