// ВСТАВИТИ ВІДЕО ЩОБ ЗАПИСАТИ КАНАЛ ДО БЖ РОБОЧА ФУНКЦІЯ

const idVideo = "XepHAXdhO7M";

const ytdl = require("ytdl-core");
const { db } = require("../../model/dbConnection");

const url = `https://www.youtube.com/watch?v=${idVideo}`;

(async () => {
  try {
    const info = await ytdl.getInfo(url);
    const channelId = info.player_response.videoDetails.channelId;
    const videoCategoryId = info.videoDetails.category;
    const ownerChannelName = info.videoDetails.ownerChannelName;

    const sqlQuery = `INSERT INTO channel (channeTitle, channelId, category) VALUES (?, ?, ?)`;

    db.query(
      sqlQuery,
      [ownerChannelName, channelId, videoCategoryId],
      (err, result) => {
        if (err) {
          console.log(err);
        }
      }
    );

    console.log(channelId);
    console.log(videoCategoryId);
    console.log(ownerChannelName);
  } catch (error) {
    console.error(error);
  }
})();
