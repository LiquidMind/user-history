const fs = require("fs");
const path = require("path");
const langdetect = require("langdetect");
const { db } = require("../model/dbConnection");
require("dotenv").config();
const checkVideos = require("./original_language");
const _ = require("lodash");

const { KEYMAX, KEY2, KEY33 } = process.env;
const URL = "https://www.googleapis.com/youtube/v3/videos";

let lastId = null;
let currentKeyIndex = 0;
const apiKeys = [KEYMAX, KEY2, KEY33]; // List of available API keys

function removeNonStandardChars(string) {
  return string.replace(/[\p{Emoji}]/gu, "");
}

setInterval(() => {
  const mysqlQuery =
    "SELECT id FROM videos_all WHERE addAllInfo = 0 ORDER BY CASE WHEN lengthVideo = 0 THEN 0 ELSE 1 END, lengthVideo DESC";

  db.query(mysqlQuery, async function (err, results) {
    if (err) {
      console.error(err);
      return;
    }
    if (results.length > 0) {
      const rowID = Object.values(results[0]);
      if (!lastId || rowID !== lastId) {
        console.log(rowID);
        lastId = rowID;
        await checkVideos(rowID);
        await historyId(rowID);
      }
    }
  });
}, 5000);

async function historyId(arrViewes) {
  fetch(
    `${URL}?part=snippet&part=statistics&part=contentDetails&part=status&id=${arrViewes}&key=${apiKeys[currentKeyIndex]}`
  )
    .then((response) => {
      if (response.status === 403) {
        // If current key quota is exceeded, switch to the next key
        currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
        throw new Error("API key quota exceeded. Switching to next key...");
      }
      return response.json();
    })
    .then((data) => {
      // Process the video information
      videoInfo(...data.items);
    })
    .catch((error) => {
      console.log(error.message);
      const sqlQuery = "UPDATE videos_all SET addAllInfo = NULL WHERE id=?";
      db.query(sqlQuery, [arrViewes], (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          console.log("Значення addAllInfo встановлено на NULL");
        }
      });
    });

  function videoInfo(info) {
    let langDetected = "";
    let vieweVideo = 0;
    let likeVideo = 0;
    let durationInSeconds = 1;

    // Additional Fields
    let publishedAt = null;
    let channelId = null;
    let channelTitle = null;
    let dimension = null;
    let definition = null;
    let caption = 0;
    let favoriteCount = 0;
    let commentCount = 0;
    let uploadStatus = null;
    let privacyStatus = null;
    let license = null;
    let publicStatsViewable = 0;
    let madeForKids = 0;
    let defaultLanguage = null;

    if (info !== undefined) {
      const lengOne = info?.contentDetails?.duration;

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

      vieweVideo = info?.statistics?.viewCount || 0;
      likeVideo = info?.statistics?.likeCount || 0;

      const description = info?.snippet?.localized?.description || "";
      const title = info?.snippet?.localized?.title || "";

      const detectedLanguage = langdetect.detect(description);
      const detectedTitle = langdetect.detect(title);

      const avtoLang = "en";

      if (detectedLanguage !== null) {
        langDetected = detectedLanguage[0].lang;
      } else if (detectedTitle !== null) {
        langDetected = detectedTitle[0].lang;
      } else {
        langDetected = avtoLang;
      }

      publishedAt = info?.snippet?.publishedAt || null;
      channelId = info?.snippet?.channelId || null;
      channelTitle = info?.snippet?.channelTitle || null;

      channelId = info?.snippet?.channelId || null;
      channelTitle = info?.snippet?.channelTitle
        ? _.unescape(removeNonStandardChars(info.snippet.channelTitle))
        : null;

      dimension = info?.contentDetails?.dimension || null;
      dimension = info?.contentDetails?.dimension || null;
      definition = info?.contentDetails?.definition || null;
      caption = info?.contentDetails?.caption === true ? 1 : 0;
      favoriteCount = parseInt(info?.statistics?.favoriteCount) || 0;
      commentCount = parseInt(info?.statistics?.commentCount) || 0;
      uploadStatus = info?.status?.uploadStatus || null;
      privacyStatus = info?.status?.privacyStatus || null;
      license = info?.status?.license || null;
      publicStatsViewable = info?.status?.publicStatsViewable === true ? 1 : 0;
      madeForKids = info?.status?.madeForKids === true ? 1 : 0;
      defaultLanguage = info?.snippet?.defaultAudioLanguage || null;
    }

    console.log({
      vieweVideo,
      likeVideo,
      durationInSeconds,
      langDetected,
      publishedAt,
      channelId,
      channelTitle,
      dimension,
      definition,
      caption,
      favoriteCount,
      commentCount,
      uploadStatus,
      privacyStatus,
      license,
      publicStatsViewable,
      madeForKids,
      defaultLanguage,
    });

    // Save description to a file
    if (info?.id && info?.snippet?.localized?.description) {
      const videoId = info.id;
      const filename = path.join(
        "/Users/andrijkozevnikov/Documents/ProjectYoutube/Archive/description",
        `${videoId}.txt`
      );

      fs.writeFile(filename, info.snippet.localized.description, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Опис збережено до ${filename}`);
        }
      });
    }
    channelTitle = removeNonStandardChars(channelTitle);

    const sqlQuery =
      "UPDATE videos_all SET viewes=?, oklike=?, lengthVideo=?, language=?, default_language=?, published_at=STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%sZ'), channel_id=?, channel_title=?, dimension=?, definition=?, caption=?, favorite_count=?, comment_count=?, upload_status=?, privacy_status=?, license=?, public_stats_viewable=?, made_for_kids=?, addAllInfo = 1 WHERE id=?";
    db.query(
      sqlQuery,
      [
        vieweVideo,
        likeVideo,
        durationInSeconds,
        langDetected ? langDetected : null,
        defaultLanguage,
        publishedAt ? publishedAt.replace("Z", "") : null,
        channelId,
        channelTitle,
        dimension,
        definition,
        caption,
        favoriteCount,
        commentCount,
        uploadStatus,
        privacyStatus,
        license,
        publicStatsViewable,
        madeForKids,
        arrViewes,
      ],
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
