const fs = require("fs");
const { db } = require("../model/dbConnection");
const addDB = require("./addInDB/addWordDB");
const csv = require("csv-parser");
const path = require("path");

let lastId = null;

setInterval(() => {
  const mysqlQuery =
    "SELECT id FROM videos_all WHERE statusWord = 'false' AND statusSub = 'subtitleSaved' ORDER BY viewes DESC";

  db.query(mysqlQuery, function (err, results) {
    if (err) {
      console.error(err);
      return;
    }
    if (results.length > 0) {
      const rowID = Object.values(results[0]);
      if (rowID !== lastId) {
        console.log(rowID);
        frequency(rowID);
        lastId = rowID;
      }
    }
  });
}, 3000);

async function frequency(objWords) {
  console.log(objWords);
  try {
    const sqlQuery = "UPDATE videos_all SET statusWord = ? WHERE id = ?";
    db.query(sqlQuery, [1, objWords], (err, result) => {
      if (err) {
        console.log(err);
        // reject(err);
      }
      console.log(result);
    });

    const fileName = objWords;

    const stemsFilePath = `/Users/andrijkozevnikov/Documents/ProjectYoutube/videos_files_words/files/${fileName}/stems_frequencies_sorted.csv`;
    processFile(
      stemsFilePath,
      "user-history/src/subtitle/wordAndIndexInFolders",
      fileName
    );

    const wordsFilePath = `/Users/andrijkozevnikov/Documents/ProjectYoutube/videos_files_words/files/${fileName}/words_frequencies_sorted.csv`;
    processFile(
      wordsFilePath,
      "user-history/src/subtitle/wordWoleAndIndexInFolders",
      fileName
    );

    await addDB(objWords);
    console.log("ADD DB");
  } catch (error) {
    console.error("Error in frequency:", error);
  }
}

function processFile(filePath, folderName, fileName) {
  try {
    if (fs.existsSync(filePath)) {
      processCSV(filePath, folderName, fileName);
    } else {
      const jsonFilePath1 = `../json_subtitle/${fileName}/countWholeWords_${fileName}.json`;
      const jsonFilePath2 = `./json_subtitle/${fileName}/count___${fileName}.json`;
      let jsonData;

      if (fs.existsSync(jsonFilePath1)) {
        jsonData = require(path.resolve(jsonFilePath1));
      } else if (fs.existsSync(jsonFilePath2)) {
        jsonData = require(path.resolve(jsonFilePath2));
      }

      if (jsonData) {
        for (const key in jsonData) {
          const pathParts = key.split("").join("/");
          createDir(pathParts, folderName, fileName, fileName);
        }
      }
    }
  } catch (error) {
    console.error("Error in processFile:", error);
  }
}

function processCSV(filePath, folderName, fileName) {
  try {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv({ headers: ["key", "value"] }))
      .on("data", (data) => {
        const key = data.key.trim();
        const value = data.value.trim();
        const obj = {};
        obj[key] = value;
        results.push(obj);
      })
      .on("end", () => {
        for (let i = 0; i < results.length; i++) {
          const resObj = results[i];
          const word = Object.keys(resObj)[0];
          const count = Object.values(resObj)[0];

          if (word) {
            const pathParts = word.split("").join("/");
            console.log(pathParts);
            createDir(pathParts, folderName, fileName, `${fileName}:${count}`);
          }
        }
      })
      .on("error", (error) => {
        console.error("Error in processCSV:", error);
      });
  } catch (error) {
    console.error("Error in processCSV:", error);
  }
}

function createDir(path, folderName, fileName, data) {
  const basePath = `/Users/andrijkozevnikov/Documents/ProjectYoutube/${folderName}`;
  const subPath = `${basePath}/${path}`;
  const filePath = `${subPath}.txt`;

  try {
    fs.mkdirSync(subPath, { recursive: true });
    fs.appendFileSync(filePath, `${data},`);
  } catch (error) {
    console.error("Error in createDir:", error);
  }
}
