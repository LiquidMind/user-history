// // ВСТАВИТИ ВІДЕО ЩОБ ЗАПИСАТИ КАНАЛ ДО БЖ РОБОЧА ФУНКЦІЯ

// const ytdl = require("ytdl-core");
// const { db } = require("../../model/dbConnection");

// const url = `https://www.youtube.com/watch?v=ufT62Qz4fCw`;

// (async () => {
//   try {
//     const info = await ytdl.getInfo(url);
//     const channelId = info.player_response.videoDetails.channelId;
//     const videoCategoryId = info.videoDetails.category;
//     const ownerChannelName = info.videoDetails.ownerChannelName;

//     // const sqlQuery = `INSERT INTO channel (channeTitle, channelId, category) VALUES (?, ?, ?)`;

//     // db.query(
//     //   sqlQuery,
//     //   [ownerChannelName, channelId, videoCategoryId],
//     //   (err, result) => {
//     //     if (err) {
//     //       console.log(err);
//     //     }
//     //   }
//     // );

//     console.log(channelId);
//     console.log(videoCategoryId);
//     console.log(ownerChannelName);
//   } catch (error) {v
//     console.error(error);
//   }
// })();

// COD WITH API

const axios = require("axios");
const { db } = require("../../model/dbConnection");
const videoId = "RNQFVw-Z25w";
const apiKey = "AIzaSyDs6h228Zj__2j37GWw1Lwx8YgCUFr6M2o";

const getVideoDetails = async (videoId, apiKey) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
    );

    const items = response.data.items;
    if (items.length > 0) {
      const videoDetails = {
        channelId: items[0].snippet.channelId,
        channelTitle: items[0].snippet.channelTitle,
        category: items[0].snippet.categoryId,
      };

      return videoDetails;
    } else {
      throw new Error("Video not found");
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

// Виклик функції для отримання деталей відео
getVideoDetails(videoId, apiKey)
  .then((videoDetails) => {
    if (videoDetails) {
      const ownerChannelName = videoDetails.channelTitle;
      const channelId = videoDetails.channelId;
      const videoCategoryId = videoDetails.category;

      const getCategoryName = (categoryId) => {
        switch (categoryId) {
          case "1":
            return "Film & Animation";
          case "2":
            return "Autos & Vehicles";
          case "10":
            return "Music";
          case "15":
            return "Pets & Animals";
          case "17":
            return "Sports";
          case "19":
            return "Travel & Events";
          case "20":
            return "Gaming";
          case "23":
            return "Comedy";
          case "24":
            return "Entertainment";
          case "25":
            return "News & Politics";
          case "26":
            return "How-to & Style";
          case "27":
            return "Education";
          case "28":
            return "Science & Technology";
          case "29":
            return "Nonprofits & Activism";
          default:
            return "Unknown Category";
        }
      };

      console.log("Channel ID:", channelId);
      console.log("Channel Title:", ownerChannelName);
      console.log("Category:", getCategoryName(videoCategoryId));

      const sqlQuery = `INSERT INTO channels (channeTitle, channelId, category) VALUES (?, ?, ?)`;

      db.query(
        sqlQuery,
        [ownerChannelName, channelId, getCategoryName(videoCategoryId)],
        (err, result) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
