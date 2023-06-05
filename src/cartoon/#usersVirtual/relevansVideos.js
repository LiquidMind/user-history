const fs = require("fs");
const { db } = require("../../model/dbConnection");
const { google } = require("googleapis");
const transliteration = require("transliteration");
const addVirtualUser = require("../virtualUsrCartoon/addVirtualUser");
const insertDataFromFile = require("./addVideoIdDB");
// const arrTagJson = require("./addVideoIdDB");

const apiKey = "AIzaSyBkUQj9uoanlVgZWB8_LPgsxrBUIoSgV-Y";
const hashtags = ["мультики"];
const youtube = google.youtube({
  version: "v3",
  auth: apiKey,
});

let uniqueVideoIds = [];

async function getChannelInfoByHashtags(hashtags, iteration) {
  let newVideoIds = [];

  for (const hashtag of hashtags) {
    const sortBy = "relevance";
    let nextPageToken = "";
    const latinHashtag = transliteration.slugify(hashtag, { lowercase: true });
    const jsonFileName = `/Users/andrijkozevnikov/Documents/ProjectYoutube/videoIdHashtag/${latinHashtag}/uniqueVideoIds.json`;

    const sqlQuery = `CREATE TABLE IF NOT EXISTS tag_${latinHashtag} (
  id INT AUTO_INCREMENT PRIMARY KEY,
  video_id VARCHAR(255) NOT NULL UNIQUE,
  addJson TINYINT DEFAULT 0
)`;

    try {
      await new Promise((resolve, reject) => {
        db.query(sqlQuery, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
      console.log("Таблиця  успішно створена");
    } catch (err) {
      console.log("Таблиця  вже існує", err);
    }

    console.log(`Таблиця `);
    try {
      addVirtualUser(latinHashtag);
    } catch (error) {
      console.log(error);
    }
    // Завантаження унікальних ідентифікаторів відео з JSON-файлу
    if (fs.existsSync(jsonFileName)) {
      uniqueVideoIds = JSON.parse(fs.readFileSync(jsonFileName));
    }

    const hashtagDir = `/Users/andrijkozevnikov/Documents/ProjectYoutube/videoIdHashtag/${latinHashtag}`;

    if (!fs.existsSync(hashtagDir)) {
      fs.mkdirSync(hashtagDir);
    }

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

    const fileNameAll = `/Users/andrijkozevnikov/Documents/ProjectYoutube/videoIdHashtag/${latinHashtag}/all_${iteration}.txt`;
    const fileNameNew = `/Users/andrijkozevnikov/Documents/ProjectYoutube/videoIdHashtag/${latinHashtag}/new_${iteration}.txt`;

    await saveVideoIdsToFile(uniqueVideoIds, fileNameAll);
    await saveVideoIdsToFile(newVideoIds, fileNameNew);

    // Збереження унікальних ідентифікаторів відео в JSON-файл
    fs.writeFileSync(jsonFileName, JSON.stringify(uniqueVideoIds, null, 2));

    await insertDataFromFile(latinHashtag);
  }
}

async function saveVideoIdsToFile(videoIds, fileName) {
  const content = videoIds.join("\n") + "\n" + videoIds.length;
  fs.writeFileSync(fileName, content);
  console.log(`Ідентифікатори відео збережено у файлі ${fileName}`);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  let iteration = process.argv[2];

  if (!iteration) {
    console.log("Ви не вказали номер ітерації.");
    return;
  }

  iteration = Number(iteration);
  if (isNaN(iteration)) {
    console.log("Номер ітерації повинен бути числом.");
    return;
  }

  for (let i = 0; i < 5; i++) {
    console.log(`Розпочинається ітерація ${iteration + i}`);
    try {
      await getChannelInfoByHashtags(hashtags, iteration + i);
      await delay(5000); // Затримка в 5 секунд
    } catch (error) {
      console.log("Сталася помилка:", error.message);
    }
  }
}

main();
