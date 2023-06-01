const fs = require("fs");
const { google } = require("googleapis");
const transliteration = require("transliteration");

const apiKey = "AIzaSyAJt2fz9w_9QstZHOj_RiNdq8iPV3FBVyA";
const hashtags = ["мультфільм"];

const youtube = google.youtube({
  version: "v3",
  auth: apiKey,
});

const jsonFileName = "./uniqueVideoIds.json";
let uniqueVideoIds = [];

// Завантаження унікальних ідентифікаторів відео з JSON-файлу
if (fs.existsSync(jsonFileName)) {
  uniqueVideoIds = JSON.parse(fs.readFileSync(jsonFileName));
}

async function getChannelInfoByHashtags(hashtags, iteration) {
  let newVideoIds = [];

  for (const hashtag of hashtags) {
    const sortBy = "relevance";
    let nextPageToken = "";

    while (true) {
      const response = await youtube.search.list({
        part: "snippet",
        maxResults: 50,
        q: `#${hashtag}`,
        type: "video",
        pageToken: nextPageToken,
        order: sortBy,
      });

      const videos = response.data.items;

      for (const video of videos) {
        const videoId = video.id.videoId;

        if (!uniqueVideoIds.includes(videoId)) {
          uniqueVideoIds.push(videoId);
          newVideoIds.push(videoId);
        }
      }

      if (!response.data.nextPageToken) {
        break;
      }

      nextPageToken = response.data.nextPageToken;
    }

    const latinHashtag = transliteration.slugify(hashtag, { lowercase: true });
    const fileNameAll = `./all_${iteration}.txt`;
    const fileNameNew = `./new_${iteration}.txt`;

    await saveVideoIdsToFile(uniqueVideoIds, fileNameAll);
    await saveVideoIdsToFile(newVideoIds, fileNameNew);
  }

  // Збереження унікальних ідентифікаторів відео в JSON-файл
  fs.writeFileSync(jsonFileName, JSON.stringify(uniqueVideoIds, null, 2));
}

async function saveVideoIdsToFile(videoIds, fileName) {
  const content = videoIds.join("\n") + "\n" + videoIds.length;
  fs.writeFileSync(fileName, content);
  console.log(`Ідентифікатори відео збережено у файлі ${fileName}`);
}

async function main() {
  const iteration = process.argv[2];

  if (!iteration) {
    console.log("Ви не вказали номер ітерації.");
    return;
  }

  try {
    await getChannelInfoByHashtags(hashtags, iteration);
  } catch (error) {
    console.log("Сталася помилка:", error.message);
  }
}

main();
