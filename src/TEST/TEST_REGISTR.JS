const fs = require("fs");
const { google } = require("googleapis");

// Встановіть ваш ключ API тут
const API_KEY = "AIzaSyDs6h228Zj__2j37GWw1Lwx8YgCUFr6M2o";

// Створення клієнта YouTube Data API
const youtube = google.youtube({
  version: "v3",
  auth: API_KEY,
});

// Отримання ID найбільш популярних відео на YouTube за рік 2023
async function getPopularVideos() {
  try {
    let videoIds = [];
    let nextPageToken = null;
    let remainingResults = 3;

    while (remainingResults > 0) {
      const response = await youtube.search.list({
        part: "id",
        maxResults: Math.min(50, remainingResults),
        pageToken: nextPageToken,
        order: "viewCount",
        publishedAfter: "2023-01-01T00:00:00Z",
        publishedBefore: "2024-01-01T00:00:00Z",
        type: "video",
      });

      const items = response.data.items;
      videoIds = videoIds.concat(items.map((item) => item.id.videoId));

      if (response.data.nextPageToken) {
        nextPageToken = response.data.nextPageToken;
      } else {
        break;
      }

      remainingResults -= items.length;
    }

    return videoIds;
  } catch (error) {
    console.error("Сталася помилка при отриманні ID відео:", error.message);
    throw error;
  }
}

function getVideoDetails(videoId) {
  return new Promise((resolve, reject) => {
    youtube.videos.list(
      {
        part: "snippet,contentDetails,statistics",
        id: videoId,
      },
      (err, response) => {
        if (err) {
          console.error("Сталася помилка при отриманні деталей відео:", err);
          reject(err);
          return;
        }

        const videoDetails = response.data.items[0];
        const snippet = videoDetails.snippet;
        const contentDetails = videoDetails.contentDetails;

        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const videoLength = parseISO8601Duration(contentDetails.duration);
        const publishedAt = snippet.publishedAt;

        const details = {
          id: videoId,
          title: snippet.title,
          videoUrl,
          lengthVideo: videoLength,
          timeDate: new Date(publishedAt),
        };

        resolve(details);
      }
    );
  });
}

// Функція для розбору формату ISO 8601 для довжини відео та перетворення його в секунди
function parseISO8601Duration(duration) {
  const match = duration.match(
    /P(?:\d+Y)?(?:\d+M)?(?:\d+D)?(?:T(?:\d+H)?(?:\d+M)?(?:\d+S)?)?/
  );

  const durationInSeconds = match[0] ? match[0] : "";
  const durationArray = durationInSeconds.match(/\d+/g);

  let totalSeconds = 0;
  if (durationArray) {
    if (durationArray.length >= 4) {
      totalSeconds += parseInt(durationArray[0]) * 86400; // Додати дні в секундах
      totalSeconds += parseInt(durationArray[1]) * 3600; // Додати години в секундах
      totalSeconds += parseInt(durationArray[2]) * 60; // Додати хвилини в секундах
      totalSeconds += parseInt(durationArray[3]); // Додати секунди
    } else if (durationArray.length === 3) {
      totalSeconds += parseInt(durationArray[0]) * 3600; // Додати години в секундах
      totalSeconds += parseInt(durationArray[1]) * 60; // Додати хвилини в секундах
      totalSeconds += parseInt(durationArray[2]); // Додати секунди
    } else if (durationArray.length === 2) {
      totalSeconds += parseInt(durationArray[0]) * 60; // Додати хвилини в секундах
      totalSeconds += parseInt(durationArray[1]); // Додати секунди
    } else if (durationArray.length === 1) {
      totalSeconds += parseInt(durationArray[0]); // Додати секунди
    }
  }

  return totalSeconds;
}

// Головна функція для отримання найпопулярніших відео 2023 року та їх деталей
async function getPopularVideos2023AndDetails() {
  try {
    const videoIds = await getPopularVideos();

    const videoDetailsPromises = videoIds.map(async (videoId) => {
      const details = await getVideoDetails(videoId);
      return details;
    });

    const videoDetails = await Promise.all(videoDetailsPromises);

    writeVideoDetailsToFile(videoDetails);
  } catch (error) {
    console.error("Сталася помилка:", error.message);
  }
}

// Виклик функції для отримання найпопулярніших відео 2023 року та їх деталей
getPopularVideos2023AndDetails();
