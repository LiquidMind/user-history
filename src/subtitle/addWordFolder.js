const fs = require("fs");
const { db } = require("../model/dbConnection");
const addDB = require("./addInDB/addWordDB");

lastId = null;

setInterval(() => {
  const mysqlQuery =
    "SELECT user_history_youtube_id FROM user_history_youtube WHERE statusWord = 'false' AND statusSub='subtitleSaved'  ORDER BY viewes DESC";

  db.query(mysqlQuery, function (err, results) {
    if (err) {
      console.error(err);
      return;
    }
    if (results.length > 0) {
      const rowID = Object.values(results[0]);
      console.log(rowID);
      if (rowID !== lastId) {
        console.log(rowID);
        frequency(rowID);
        lastId = rowID;
      }
    }
  });
}, 3000);

async function frequency(objWords) {
  try {
    const sqlQuery =
      "UPDATE user_history_youtube SET statusWord=? WHERE user_history_youtube_id=?";
    db.query(sqlQuery, [1, objWords], (err, result) => {
      if (err) {
        console.log(err);
        // reject(err);
      }
      console.log(result);
    });
    const objWord = require(`./json_subtitle/${objWords}/count_${objWords}.json`);
    const arrays = Object.entries(objWord);

    console.log(arrays);
    function createDir(path, numb) {
      const parts = path.split("/");
      const filename = parts.pop() + ".txt";
      for (let i = 1; i <= parts.length; i++) {
        const subPath =
          "./src/subtitle/wordAndIndexInFolders/" + parts.slice(0, i).join("/");
        console.log(subPath);
        if (!fs.existsSync(subPath)) {
          fs.mkdirSync(subPath);
        }
      }
      const filePath =
        "./src/subtitle/wordAndIndexInFolders/" +
        parts.join("/") +
        "/" +
        filename;
      // console.log(filePath);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, `${objWords}:${numb},`);
      } else {
        fs.appendFileSync(filePath, `${objWords}:${numb},`);
      }
    }

    for (let i = 0; i < arrays.length; i++) {
      const [a, b] = arrays[i];

      const letters = a.split("").join("/");
      createDir(letters, b);
    }
  } catch (error) {
    console.error("Error in sortWord:", error);
  }

  ////////////////////////////////////

  try {
    const sqlQuery =
      "UPDATE user_history_youtube SET statusWord=? WHERE user_history_youtube_id=?";
    db.query(sqlQuery, [1, objWords], (err, result) => {
      if (err) {
        console.log(err);
        // reject(err);
      }
      console.log(result);
    });
    const objWord = require(`./json_subtitle/${objWords}/countWholeWords_${objWords}.json`);
    const arrays = Object.entries(objWord);

    console.log(arrays);
    function createDir(path, numb) {
      const parts = path.split("/");
      const filename = parts.pop() + ".txt";
      for (let i = 1; i <= parts.length; i++) {
        const subPath =
          "./src/subtitle/wordWoleAndIndexInFolders/" +
          parts.slice(0, i).join("/");
        console.log(subPath);
        if (!fs.existsSync(subPath)) {
          fs.mkdirSync(subPath);
        }
      }
      const filePath =
        "./src/subtitle/wordWoleAndIndexInFolders/" +
        parts.join("/") +
        "/" +
        filename;
      // console.log(filePath);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, `${objWords}:${numb},`);
      } else {
        fs.appendFileSync(filePath, `${objWords}:${numb},`);
      }
    }
    // for (const word of arrays) {
    //   console.log(word);
    // }
    for (let i = 0; i < arrays.length; i++) {
      const [a, b] = arrays[i];

      const letters = a.split("").join("/");
      createDir(letters, b);
    }
  } catch (error) {
    console.error("Error in sortWord:", error);
  }

  //ADD DB

  try {
    await addDB(objWords);
    console.log("ADD DB");
    const mysqlQuery = `UPDATE user_history_youtube SET statusSub = 'subtitleSaved' WHERE user_history_youtube_id = "${objWords}"`;
    db.query(mysqlQuery, (err, result) => {
      if (err) throw err;
      console.log("Number of rows affected:", result.affectedRows);
    });
  } catch (error) {
    console.error("Error in addDB:", error);
  }
}
// frequency("___lVbYXor8");
