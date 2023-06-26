const ytdl = require("ytdl-core");
const { db } = require("../model/dbConnection");

async function checkVideos(videoId) {
  const url = `https://www.youtube.com/watch?v=${videoId}`;

  try {
    const info = await ytdl.getInfo(url);
    const captionRenderer =
      info.player_response.captions?.playerCaptionsTracklistRenderer;
    const originalLanguage = captionRenderer
      ? captionRenderer.captionTracks[0].languageCode
      : null;

    let updateQuery =
      "UPDATE videos_all SET original_language = ? WHERE id = ?";
    db.query(updateQuery, [originalLanguage, videoId], (err) => {
      if (err) throw err;
      console.log(`Updated video with id: ${videoId}`);
    });
  } catch (error) {
    console.error(`Failed to update video with id: ${videoId}`);
    console.error(error);
  }
}
// checkVideos("81oWdDs5pOA");
module.exports = checkVideos;
