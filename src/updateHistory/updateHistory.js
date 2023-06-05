const { db } = require("../model/dbConnection");
const moment = require("moment");
const decrypt = require("../openZip/decrypt");
const addHistoryAllDb = require("../cartoon/virtualUsrCartoon/addHistoryAllDb");

// New function
// async function addHistoryAllDb() {
//   return new Promise((resolve, reject) => {
//     console.log("Processing addHistoryAllDb function...");
//     // Your logic here
//     // When done:
//     resolve();
//     // If error occurs:
//     // reject(error);
//   });
// }

async function fetchAndUpdate() {
  const sqlQuery = `SELECT id, google_email, google_password, historyUpdatedAt FROM google_users ORDER BY historyUpdatedAt ASC LIMIT 1`;

  db.query(sqlQuery, async (err, result) => {
    if (err) {
      console.error(err);
      return;
    }

    if (result.length > 0) {
      const row = result[0];
      console.log(row);

      if (row.google_password === "virtual") {
        const nameChannel = row.google_email;
        const id = row.id;
        try {
          await addHistoryAllDb(nameChannel, id);
          console.log("addHistoryAllDb function has finished its work");
        } catch (error) {
          console.error("An error occurred in addHistoryAllDb:", error);
          return;
        }
      } else if (row.google_password !== "noPassword") {
        decrypt(row.google_email, row.google_password.trim());
      }

      const updateQuery = `UPDATE google_users SET historyUpdatedAt = NOW() WHERE google_email = "${row.google_email}"`;

      db.query(updateQuery, (err, result) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(
          `historyUpdatedAt set to NOW() for email ${row.google_email}`
        );
      });
    } else {
      console.log("No rows found in the table");
    }

    setTimeout(fetchAndUpdate, 60000);
  });
}

fetchAndUpdate();
