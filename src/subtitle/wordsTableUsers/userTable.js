const { db } = require("../../model/dbConnection");

const util = require("util");
const addFolderWordsUser = require("./addFolderWordsUser");
const addDbUserWord = require("./addDbUserWord");
const queryAsync = util.promisify(db.query).bind(db);

const query =
  "SELECT id, historyUpdatedAt FROM google_test ORDER BY historyUpdatedAt ASC";

async function main() {
  const rows = await queryAsync(query);
  const sortedRows = rows.sort(
    (a, b) => a.historyUpdatedAt - b.historyUpdatedAt
  );

  while (true) {
    for (const row of sortedRows) {
      const { historyUpdatedAt: date, id } = row;
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
}

async function executeFunctions(userID, statusSub) {
  await Promise.all([
    addDbUserWord(statusSub, userID),
    addFolderWordsUser(statusSub, userID),
  ]);
}

async function openID(userID) {
  const sqlQuery = `SELECT videos_user_${userID}.id, videos_all.statusSub, videos_user_${userID}.status FROM videos_user_${userID} JOIN videos_all ON videos_user_${userID}.id = videos_all.id WHERE videos_all.statusSub IN ("subtitleSaved", "noSubtitle", "proces")`;

  db.query(sqlQuery, async (err, result) => {
    if (err) {
      console.log(err);
    } else {
      for (const resObj of result) {
        const resultId = resObj.id;
        const statusSub = resObj.statusSub;
        const userStatus = resObj.status;
        let newStatus;

        if (userStatus === "saveWords") {
          continue;
        }

        try {
          if (statusSub === "subtitleSaved") {
            await executeFunctions(userID, resultId);

            newStatus = "saveWords";
          } else if (statusSub === "noSubtitle") {
            newStatus = "noSubtitles";
          } else if (statusSub === "proces") {
            newStatus = "noWords";
          }
        } catch (error) {
          newStatus = "noWords";
        }

        if (newStatus) {
          const sqlQuery3 = `UPDATE videos_user_${userID} SET status = "${newStatus}" WHERE id = "${resultId}"`;
          await queryAsync(sqlQuery3);
          console.log(`Video ${resultId} status updated to ${newStatus}`);
        }
      }
    }
  });
}
//////////////
main().catch((err) => console.error(err));
