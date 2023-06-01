const axios = require("axios");
const util = require("util");
const { db } = require("../../model/dbConnection");
const keys = require("../../../data.json");

// These are your API keys.
const apiKeys = keys;

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
  let apiKeyIndex = 0;

  while (nextPageToken != undefined) {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          params: {
            key: apiKeys[apiKeyIndex],
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

      if (apiKeyIndex < apiKeys.length - 1) {
        apiKeyIndex++;
        continue;
      } else {
        throw error;
      }
    }
  }

  const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");

  const insertQuery = `INSERT INTO videos_user_7 (id, channelId, channeTitle, dateRecorded) VALUES ? ON DUPLICATE KEY UPDATE id=id`;

  const insertValues = videoIds.map((videoId) => [
    videoId,
    channelId,
    channeTitle,
    currentDate,
  ]);

  await executeQuery(insertQuery, [insertValues]);

  const updateQuery = `UPDATE channels SET numberOfVideos = ? WHERE channelId = ?`;
  await executeQuery(updateQuery, [videoIds.length, channelId]);

  console.log(videoIds);
  console.log("Total video count: " + videoIds.length);
}

async function main() {
  while (true) {
    const sqlQuery = `SELECT channeTitle , channelId FROM channels WHERE numberOfVideos = 0`;
    const channels = await asyncQuery(sqlQuery);

    for (let element of channels) {
      await processChannel(element);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
}

main();
