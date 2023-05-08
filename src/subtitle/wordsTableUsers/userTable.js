const { db } = require("../../model/dbConnection");
const addDbUserWord = require("./addDbUserWord");
const util = require("util");
const addFolderWordsUser = require("./addFolderWordsUser");

const queryAsync = util.promisify(db.query).bind(db);

const query =
  "SELECT id, historyUpdatedAt FROM google_users ORDER BY historyUpdatedAt ASC";

async function main() {
  const rows = await queryAsync(query);

  let currentDateIndex = 0;
  const dateIdPairs = rows.map((row) => ({
    date: row.historyUpdatedAt,
    id: row.id,
  }));

  function getNextDateIdPair() {
    const currentDateIdPair = dateIdPairs[currentDateIndex];
    currentDateIndex = (currentDateIndex + 1) % dateIdPairs.length;
    return currentDateIdPair;
  }

  while (true) {
    const { date, id } = getNextDateIdPair();
    console.log(`Date: ${date}, ID: ${id}`);
    const sqlQuery = `CREATE TABLE IF NOT EXISTS words_user_${id} (
    id INT AUTO_INCREMENT PRIMARY KEY,
     words VARCHAR(255) NOT NULL UNIQUE, 
    number INT NOT NULL,
    numberOfVideo INT NOT NULL
    )`;

    try {
      await queryAsync(sqlQuery);
      console.log("Table created successfully");
    } catch (err) {
      console.error(err);
      return;
    }

    await openID(id);
    await new Promise((resolve) => setTimeout(resolve, 5000)); // 600000 ms = 10 minutes
  }
}

async function openID(userID) {
  const sqlQuery = `SHOW TABLES LIKE 'videos_user_${userID}'`;

  try {
    await addFolderWordsUser(userID); // викликаємо функцію addFolderWordsUser з await
    console.log("addFolderWordsUser completed successfully");
  } catch (error) {
    console.log("addFolderWordsUser failed with error:", error);
  }

  const result = await queryAsync(sqlQuery);

  if (result.length === 0) {
    console.log(`Table videos_user_${userID} not found`);
    return;
  }

  const sqlQuery2 = `SELECT id FROM videos_user_${userID} WHERE addWords = 0 AND status = 'proces'`;

  const result2 = await queryAsync(sqlQuery2);

  for (let i = 0; i < result2.length; i++) {
    const userObjId = result2[i];
    const userIdResult = Object.values(userObjId)[0];
    console.log(userIdResult);

    await addDbUserWord(userIdResult, userID);

    const sqlQuery3 = `UPDATE videos_user_${userID} SET addWords = 1 WHERE id = "${userIdResult}"`;

    try {
      const result3 = await queryAsync(sqlQuery3);
      console.log(result3);
    } catch (err) {
      console.error(err);
      return;
    }
  }
}

main().catch((err) => console.error(err));
