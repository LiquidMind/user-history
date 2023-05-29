const langdetect = require("langdetect");
const fs = require("fs");
const path = require("path");
const { db } = require("../model/dbConnection");
require("dotenv").config();
const { KEY, KEY33 } = process.env;
const URL = "https://www.googleapis.com/youtube/v3/videos";

let lastId = null;

setInterval(() => {
  const mysqlQuery = "SELECT id FROM videos_all WHERE lengthVideo = 'false'";

  db.query(mysqlQuery, function (err, results) {
    if (err) {
      console.error(err);
      return;
    }
    if (results.length > 0) {
      const rowID = Object.values(results[0]);
      if (rowID !== lastId) {
        console.log(rowID);
        historyId(rowID);
        lastId = rowID;
      }
    }
  });
}, 1000);

function historyId(arrViewes) {
  fetch(
    `${URL}?part=snippet&part=statistics&part=contentDetails&id=${arrViewes}&key=${KEY}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      videoInfo(...data.items);
    });

  function videoInfo(info) {
    let langDetected = "";
    let vieweVideo = 0;
    let likeVideo = 0;
    let durationInSeconds = 1;
    let title = "";

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
      title = info?.snippet.localized.title;

      // Write description to file named by the video ID
      fs.writeFile(
        path.join(
          "/Users/andrijkozevnikov/Documents/ProjectYoutube/Archive/description",
          `${arrViewes}.txt`
        ),
        description,
        (err) => {
          if (err) {
            console.error("Error writing file:", err);
          } else {
            console.log(
              `Successfully wrote description to file for video ID: ${arrViewes}`
            );
          }
        }
      );

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
    }

    const sqlQuery =
      "UPDATE videos_all SET , viewes=?, oklike=?, lengthVideo=?, language=?  WHERE id=?";
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

    console.log(typeof title);
    console.log(title);
  }
}
