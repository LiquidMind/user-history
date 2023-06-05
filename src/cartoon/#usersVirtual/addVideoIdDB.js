const { db } = require("../../model/dbConnection");
const fs = require("fs");

// const latinHashtag = "multfilm";

function insertDataFromFile(latinHashtag) {
  const filePath = `/Users/andrijkozevnikov/Documents/ProjectYoutube/videoIdHashtag/${latinHashtag}/uniqueVideoIds.json`;

  console.log(latinHashtag);
  console.log(filePath);

  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const dataArray = JSON.parse(data);
      let pendingQueries = dataArray.length;

      for (let i = 0; i < dataArray.length; i++) {
        const videoId = dataArray[i];
        let insertQuery = `INSERT INTO tag_${latinHashtag} (video_id) VALUES (?)`;

        db.query(insertQuery, [videoId], (error, results) => {
          pendingQueries--;

          if (error && error.code === "ER_DUP_ENTRY") {
            console.error(`Duplicate entry ignored for video_id: ${videoId}`);
          } else if (error) {
            console.error(error);
          } else {
            console.log("Дані успішно записані в таблицю.");
          }

          if (pendingQueries === 0) {
            resolve();
          }
        });
      }
    });
  });
}

// insertDataFromFile(latinHashtag);
module.exports = insertDataFromFile;
