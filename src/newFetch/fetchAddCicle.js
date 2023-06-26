const fs = require("fs");
const path = require("path");
const langdetect = require("langdetect");
const { db } = require("../model/dbConnection");
require("dotenv").config();
const { KEY, KEY2, KEY33 } = process.env;
const URL = "https://www.googleapis.com/youtube/v3/videos";

let lastId = null;

function startInterval() {
  const mysqlQuery = "SELECT id FROM videos_all WHERE lengthVideo = 'false'";

  db.query(mysqlQuery, async function (err, results) {
    // Додаємо async тут
    if (err) {
      console.error(err);
      return;
    }
    if (results.length > 0) {
      const rowID = Object.values(results[0]);
      if (rowID !== lastId) {
        console.log(rowID);
        await checkVideos(rowID); // Тепер ми можемо використовувати await тут
        await historyId(rowID); // Також очікуємо кінця виконання historyId
        lastId = rowID;
      }
    }
    // Call this function again after 1 second
    setTimeout(startInterval, 1000);
  });
}

// Call this function initially to start the loop
startInterval();

async function historyId(arrViewes) {
  fetch(
    `${URL}?part=snippet&part=statistics&part=contentDetails&id=${arrViewes}&key=${KEY33}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // process the video information
      videoInfo(...data.items);
    });

  function videoInfo(info) {
    let langDetected = "";
    let vieweVideo = 0;
    let likeVideo = 0;
    let durationInSeconds = 1;

    if (info === undefined) {
      langDetected;
      vieweVideo;
      likeVideo;
      durationInSeconds;
    } else {
      const lengOne = info?.contentDetails.duration;

      const durationString = lengOne;
      const regex = /(\d+)D|(\d+)H|(\d+)M|(\d+)S/g;
      let match;

      while ((match = regex.exec(durationString))) {
        if (match[1]) {
          durationInSeconds += parseInt(match[1]) * 86400; // add days to total duration
        } else if (match[2]) {
          durationInSeconds += parseInt(match[2]) * 3600; // add hours to total duration
        } else if (match[3]) {
          durationInSeconds += parseInt(match[3]) * 60; // add minutes to total duration
        } else if (match[4]) {
          durationInSeconds += parseInt(match[4]); // add seconds to total duration
        }
      }

      vieweVideo = info?.statistics.viewCount;

      likeVideo = info?.statistics.likeCount;

      const description = info?.snippet.localized.description;
      const title = info?.snippet.localized.title;

      const detectedLanguage = langdetect.detect(description);
      const detectedTitle = langdetect.detect(title);

      const avtoLang = "en";

      if (detectedLanguage !== null) {
        langDetected = detectedLanguage[0].lang;
        console.log("a");
      } else if (detectedTitle !== null) {
        langDetected = detectedTitle[0].lang;
        console.log("b");
      } else {
        langDetected = avtoLang;
        console.log("c");
      }
      console.log(langDetected);

      // Add this new code
      const videoId = info?.id;
      const filename = path.join(
        "/Users/andrijkozevnikov/Documents/ProjectYoutube/Archive/description",
        `${videoId}.txt`
      );

      fs.writeFile(filename, description, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Опис збережено до ${filename}`);
        }
      });
    }
    const sqlQuery =
      "UPDATE videos_all SET   viewes=?, oklike=?, lengthVideo=?, language=?  WHERE  id=?";
    db.query(
      sqlQuery,
      [vieweVideo, likeVideo, durationInSeconds, langDetected, arrViewes],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          console.log("УСПІШНО ДОДАНО");
        }
      }
    );
  }
}
