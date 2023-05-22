const { google } = require("googleapis");
const addVideoToPlaylist = require("./addVideoToPlaylist");

async function createPlaylist(auth, videoIds, playlistName, description) {
  const service = google.youtube("v3");

  try {
    const response = await service.playlists.insert({
      auth: auth,
      part: "snippet,status",
      requestBody: {
        snippet: {
          title: playlistName,
          description: `This playlist displays your all-time watched videos by ${description}`,
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
