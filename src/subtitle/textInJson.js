const fs = require("fs");
const natural = require("natural");
const langdetect = require("langdetect");
const { db } = require("../../model/dbConnection");

// const arrHistory = require("./arrHistory/arrTest");

const textInJson = (arrHistory) => {
  return new Promise((resolve, reject) => {
    const mysqlQuery = `SELECT language FROM videos_all WHERE id = "${arrHistory}";`;
    db.query(mysqlQuery, function res(err, result) {
      if (err) {
        console.log(err);
      }
      const languageVideo = result[0].language;

      languageRes(languageVideo);
    });

    function languageRes(languageVideo) {
      console.log(languageVideo);

      // // Call the detect() function to detect the language of the string
      // const detectedLanguage = langdetect.detect(myString);
      // // Log the detected language code to the console
      // const language = detectedLanguage[0].lang;

      const vttFilePath = `./src/subtitle/subtitleVTT/${arrHistory}.${languageVideo}.vtt`;
      const folderPath = "./src/subtitle/json_subtitle";
      const fileName = `./${arrHistory}/${arrHistory}.json`;
      const folderName = `./src/subtitle/json_subtitle/${arrHistory}`;

      const a = [];

      fs.readFile(vttFilePath, "utf8", (err, data) => {
        if (err) {
          console.error("Error:", err);
          reject(err);
          return;
        }

        const vttString = data;
        a.push(vttString);

        // Create the folder
        fs.mkdir(folderName, (err) => {
          if (err) {
            console.error("Error:", err);
            reject(err);
            return;
          }
          console.log("Folder created successfully.");
          // Write the `a` variable to a new file
          fs.writeFile(
            `${folderPath}/${fileName}`,
            JSON.stringify(a),
            (err) => {
              if (err) {
                console.error("Error:", err);
                reject(err);
              } else {
                console.log("The file has been saved!");
                resolve();
              }
            }
          );
        });
      });
    }
  });
};

// textInJson("OJfzVAFW9eo"); //tets function

module.exports = textInJson;
