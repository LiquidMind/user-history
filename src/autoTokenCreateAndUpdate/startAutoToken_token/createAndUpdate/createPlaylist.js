const { google } = require("googleapis");
const addVideoToPlaylist = require("./addVideoToPlaylist");

async function createPlaylist(auth, videoIds) {
  const service = google.youtube("v3");

  try {
    const response = await service.playlists.insert({
      auth: auth,
      part: "snippet,status",
      requestBody: {
        snippet: {
          title: "Top Views",
          description: "This is a test playlist created by the YouTube API v3",
        },
        status: {
          privacyStatus: "private",
        },
      },
    });

    console.log("Created playlist with id: " + response.data.id);

    if (videoIds && videoIds.length > 0) {
      await addVideoToPlaylist(auth, response.data.id, videoIds);
    }
  } catch (err) {
    console.log("createPlaylist: the API returned an error: " + err);
  }
}

module.exports = createPlaylist;
