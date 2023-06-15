const axios = require("axios");
const { db } = require("../model/dbConnection");
const mysql = require("mysql");

async function updateVideoData(videoId) {
  try {
    const youtubeResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=AIzaSyBkUQj9uoanlVgZWB8_LPgsxrBUIoSgV-Y`
    );
    let newViews = youtubeResponse.data.items[0].statistics.viewCount;
    let newLikes = youtubeResponse.data.items[0].statistics.likeCount;

    // Замінюємо NaN на null
    if (isNaN(newViews)) newViews = null;
    if (isNaN(newLikes)) newLikes = null;

    db.query(
      `SELECT * FROM videos_updates WHERE video_id = ? AND updates = 0 ORDER BY views_per_second IS NULL DESC, prev_views DESC`,
      [videoId],
      function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          const prevDatetime = results[0].curr_datetime;
          const prevViews = results[0].curr_views;
          const prevLikes = results[0].curr_likes;

          const diffViews = newViews - prevViews;
          const diffLikes = newLikes - prevLikes;

          const currDatetime = new Date();
          const diffSeconds = (currDatetime - new Date(prevDatetime)) / 1000;

          const viewsPerSecond =
            diffViews !== 0
              ? Number((diffViews / diffSeconds).toFixed(3))
              : null;
          const likesPerSecond =
            diffLikes !== 0
              ? Number((diffLikes / diffSeconds).toFixed(3))
              : null;

          db.query(
            `
            UPDATE videos_updates
            SET 
              prev_datetime = ?,
              prev_views = ?,
              prev_likes = ?,
              curr_datetime = ?,
              curr_views = ?,
              curr_likes = ?,
              diff_seconds = ?,
              diff_views = ?,
              diff_likes = ?,
              views_per_second = ?,
              likes_per_second = ?,
              updates = 1
            WHERE video_id = ? AND updates = 0`,
            [
              prevDatetime,
              prevViews,
              prevLikes,
              mysql.raw("NOW()"),
              newViews,
              newLikes,
              diffSeconds,
              diffViews,
              diffLikes,
              viewsPerSecond,
              likesPerSecond,
              videoId,
            ],
            function (error, results, fields) {
              if (error) throw error;
              console.log("Updated successfully!");

              // Оновлення таблиці video_all
              db.query(
                `
    UPDATE videos_all
    SET
      viewes = ?,
      okLike = ?,
      views_per_second = ?,
      likes_per_second = ?
    WHERE id = ?`,
                [newViews, newLikes, viewsPerSecond, likesPerSecond, videoId],
                function (error, results, fields) {
                  if (error) throw error;
                  console.log("Updated video_all successfully!");
                  processNextVideo();
                }
              );
            }
          );
        } else {
          console.log("No updates required.");
          processNextVideo();
        }
      }
    );
  } catch (error) {
    console.error(`Error: ${error}`);
    processNextVideo();
  }
}

let videoIds = [];

function processNextVideo() {
  if (videoIds.length > 0) {
    const videoId = videoIds.shift();
    setTimeout(() => {
      updateVideoData(videoId);
    }, 5000);
  } else {
    waitForNewVideos();
  }
}

function waitForNewVideos() {
  db.query(
    `SELECT video_id FROM videos_updates WHERE updates = 0 ORDER BY views_per_second IS NULL DESC, prev_views DESC`,
    function (error, results, fields) {
      if (error) throw error;
      if (results.length > 0) {
        for (let i = 0; i < results.length; i++) {
          videoIds.push(results[i].video_id);
        }
        processNextVideo();
      } else {
        setTimeout(waitForNewVideos, 5000);
      }
    }
  );
}

waitForNewVideos();
