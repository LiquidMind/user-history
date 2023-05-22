const axios = require("axios");
const util = require("util");
const { db } = require("../../model/dbConnection");
require("dotenv").config();
const { KEY331 } = process.env;

const asyncQuery = util.promisify(db.query).bind(db);

async function executeQuery(query, values) {
  try {
    await asyncQuery(query, values);
  } catch (error) {
    console.error(error);
  }
}

async function processChannel(element) {
  const { channeTitle, channelId } = element;
  console.log(channeTitle);
  console.log(channelId);

  let videoIds = [];
  let nextPageToken = "";
  let apiKey = KEY331;

  while (nextPageToken != undefined) {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          params: {
            key: apiKey,
            channelId: channelId,
            part: "id",
            order: "date",
            maxResults: 50,
            pageToken: nextPageToken,
          },
        }
      );

      videoIds = videoIds.concat(
        response.data.items
          .filter((item) => item.id.kind === "youtube#video")
          .map((item) => item.id.videoId)
      );

      nextPageToken = response.data.nextPageToken;
    } catch (error) {
      console.error(error);

      // If KEY32 fails, use KEY33 instead
      // if (apiKey === KEY32) {
      //   apiKey = KEY33;
      //   continue;
      // } else {
      //   throw error;
      // }
    }
  }

  // Insert video IDs into 'cartoon' table
  const insertQuery = `INSERT INTO cartoon (id, channelId, channeTitle) VALUES ? ON DUPLICATE KEY UPDATE id=id`;
  const insertValues = videoIds.map((videoId) => [
    videoId,
    channelId,
    channeTitle,
  ]);

  await executeQuery(insertQuery, [insertValues]);

  // Update 'numberСartoons' in 'channel' table
  const updateQuery = `UPDATE channel SET numberOfVideos = ? WHERE channelId = ?`;
  await executeQuery(updateQuery, [videoIds.length, channelId]);

  console.log(videoIds);
  console.log("Total video count: " + videoIds.length);
}

async function main() {
  while (true) {
    const sqlQuery = `SELECT channeTitle , channelId FROM channel WHERE numberOfVideos = 0`;
    const channels = await asyncQuery(sqlQuery);

    for (let element of channels) {
      await processChannel(element);
      // Wait 5 seconds before the next iteration
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    // Wait 10 seconds before checking the database again
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
}

main();
