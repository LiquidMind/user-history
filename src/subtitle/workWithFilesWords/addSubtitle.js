const youtubedl = require("youtube-dl-exec");
// const arrTest = require("./arrHistory/arrTest");
const path = require("path");
const fs = require("fs");

const { db } = require("../../model/dbConnection");
const addSubtitle = (arrTest) => {
  return new Promise((resolve, reject) => {
    const mysqlQuery = `SELECT language FROM videos_all WHERE id = "${arrTest}";`;
    db.query(mysqlQuery, function res(err, result) {
      if (err) {
        console.log(err);
      }
      languageRes(result[0].language);
    });

    function languageRes(resultDb) {
      const videoUrl = `https://www.youtube.com/watch?v=${arrTest}`;
      const folderName =
        "/Users/andrijkozevnikov/Documents/ProjectYoutube/videos_files_words/vtt/";

      const options = {
        writeSub: true,
        writeAutoSub: true,
        subLang: `${resultDb}`,
        skipDownload: true,
        output: path.join(
          "/Users/andrijkozevnikov/Documents/ProjectYoutube/videos_files_words/vtt/",
          `${arrTest}`
        ),
      };

      // Create the folder if it does not exist
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
      }

      youtubedl(videoUrl, options)
        .then((output) => {
          console.log("Subtitles downloaded:", output);
          console.log(output); // video subtitles processed
          const sqlQuery = "UPDATE videos_all SET subtitleAdd=? WHERE id=?";
          db.query(sqlQuery, [1, arrTest], (err, result) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              console.log(result);
              resolve(result);
            }
          });
        })
        .catch((err) => {
          const sqlQuery = "UPDATE videos_all SET subtitleAdd=? WHERE id=?";
          db.query(sqlQuery, [1, arrTest], (err, result) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              console.log(result);
              resolve(result);
            }
          });
          console.error("Error:", err);
          reject(err);
        });
    }
  });
};

//test function
// addSubtitle("A-6hKtEp99c");
module.exports = addSubtitle;
