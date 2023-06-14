const fs = require("fs");
const { db } = require("../../model/dbConnection");
const transliteration = require("transliteration");
const ytdl = require("ytdl-core");

const arrTag = require("./arrTag.json");

function query(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

async function updateAddJson(latinHashtag, id) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `UPDATE tag_${latinHashtag} SET addJson = 1 WHERE video_id = ?`;
    db.query(sqlQuery, [id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

async function createJson(arrTag) {
  for (let i = 0; i < arrTag.length; i++) {
    const tag = arrTag[i];
    const latinHashtag = transliteration.slugify(tag, { lowercase: true });

    console.log(latinHashtag);
    const sqlQuery = `SELECT video_id FROM tag_${latinHashtag} WHERE addJson = 0`;

    try {
      const results = await query(sqlQuery);

      for (const resObj of results) {
        const id = resObj.video_id;
        const videoExists = await checkVideoExists(id);

        let videoData;
        if (videoExists) {
          videoData = await getVideoDataFromTable(id);
        } else {
          try {
            videoData = await getVideoDataFromAPI(id);
          } catch (error) {
            console.error(`Помилка при отриманні даних відео з API: ${error}`);
          }
        }

        if (videoData) {
          appendToJson(latinHashtag, videoData);
          console.log(videoData);

          try {
            await updateAddJson(latinHashtag, id);
          } catch (error) {
            console.error(`Помилка при оновленні addJson: ${error}`);
          }
        }
      }
    } catch (error) {
      console.error(
        `Таблиці ${latinHashtag} не існує або сталася помилка: ${error}`
      );
    }
  }
}

async function appendToJson(latinHashtag, videoData) {
  const userQuery = `SELECT id FROM google_users WHERE google_email = ?`;
  const userEmail = `tag_${latinHashtag}@youtube.com`;

  const userId = await new Promise((resolve, reject) => {
    db.query(userQuery, [userEmail], (err, rows) => {
      if (err) {
        reject(err);
      }

      if (rows.length === 0) {
        reject(`No user found for email: ${userEmail}`);
      }

      resolve(rows[0].id);
    });
  });

  const jsonFileName = `/Users/andrijkozevnikov/Documents/ProjectYoutube/VirtualUsers/videos_user_${userId}.json`;
  let data = [];

  if (fs.existsSync(jsonFileName)) {
    data = JSON.parse(fs.readFileSync(jsonFileName));
  }

  data.push(videoData);
  fs.writeFileSync(jsonFileName, JSON.stringify(data));
}

async function checkVideoExists(id) {
  const sqlQuery = `SELECT COUNT(*) AS count FROM videos_all WHERE id = ?`;
  const results = await query(sqlQuery, [id]);

  return results[0].count > 0;
}

async function getVideoDataFromTable(id) {
  const sqlQuery = `SELECT * FROM videos_all WHERE id = ?`;
  const results = await query(sqlQuery, [id]);

  const videoData = {
    id: results[0].id,
    title: results[0].title,
    titleUrl: `https://www.youtube.com/watch?v=${results[0].id}`,
    timeDate: results[0].timeDate,
  };

  return videoData;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getVideoDataFromAPI(id) {
  await sleep(1000);
  const videoInfo = await ytdl.getInfo(id);

  const videoData = {
    id: id,
    title: videoInfo.videoDetails.title,
    titleUrl: `https://www.youtube.com/watch?v=${id}`,
    timeDate: videoInfo.videoDetails.uploadDate,
    channelId: videoInfo.videoDetails.channelId,
    channeTitle: videoInfo.videoDetails.author.name,
  };

  return videoData;
}

createJson(arrTag);
