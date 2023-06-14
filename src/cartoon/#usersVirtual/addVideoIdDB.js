const { db } = require("../../model/dbConnection");
const fs = require("fs");

function insertDataFromFile(latinHashtag, publishedBefore, publishedAfter) {
  const filePath = `/Users/andrijkozevnikov/Documents/ProjectYoutube/videoIdHashtag/${latinHashtag}/uniqueVideoIds.json`;

  // Convert to MySQL compatible datetime format or 'NULL' if values are null
  const mysqlPublishedAfter = publishedAfter
    ? new Date(publishedAfter).toISOString().slice(0, 19).replace("T", " ")
    : "null";
  const mysqlPublishedBefore = publishedBefore
    ? new Date(publishedBefore).toISOString().slice(0, 19).replace("T", " ")
    : "null";

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
        let insertQuery = `INSERT INTO tag_${latinHashtag} (video_id, publishedBefore, publishedAfter, timeDate) VALUES (?, ?, ?, NOW())`;

        db.query(
          insertQuery,
          [videoId, mysqlPublishedBefore, mysqlPublishedAfter],
          (error, results) => {
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
          }
        );
      }
    });
  });
}

module.exports = insertDataFromFile;
