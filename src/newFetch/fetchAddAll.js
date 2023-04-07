const arrHistory = require("../array/arrHistory");
const arrViewes = require("../array/arrViewes");
const { db } = require("../model/dbConnection");
require("dotenv").config();
const { KEY, KEY2 } = process.env;
const URL = "https://www.googleapis.com/youtube/v3/videos";

function historyId(arrViewes) {
  for (let i = 0; i < arrViewes.length; i++) {
    const resInd = arrViewes[i];
    const titleUrl = resInd.titleUrl;
    const videoID = titleUrl?.slice(32, 47);

    function videoInfo(info) {
      const lengOne = info?.contentDetails.duration;
      console.log(lengOne);

      const durationString = lengOne;
      const regex = /(\d+)D|(\d+)H|(\d+)M|(\d+)S/g;
      let match;
      let durationInSeconds = 0;

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

      console.log(durationInSeconds);
      const vieweVideo = info?.statistics.viewCount;
      const likeVideo = info?.statistics.likeCount;

      // console.log(`${videoID} ${vieweVideo}`);

      const sqlQuery =
        "UPDATE user_history_youtube SET   viewes=?, oklike=?, lengthVideo=?  WHERE  user_history_youtube_id=?";
      db.query(
        sqlQuery,
        [vieweVideo || "0", likeVideo || "0", durationInSeconds || 0, videoID],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
          }
        }
      );
    }

    fetch(`${URL}?id=${videoID}&part=statistics&part=contentDetails&key=${KEY}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        videoInfo(...data.items);
      });
  }
}

historyId(arrHistory);
