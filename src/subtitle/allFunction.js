const { db } = require("../model/dbConnection");

lastId = null;

setInterval(() => {
  const mysqlQuery =
    "SELECT user_history_youtube_id FROM user_history_youtube WHERE subtitleAdd = 'falce' ORDER BY viewes DESC LIMIT 0, 1";

  db.query(mysqlQuery, function (err, results) {
    if (err) {
      console.error(err);
      return;
    }
    if (results.length > 0) {
      const rowID = Object.values(results[0]);
      if (rowID !== lastId) {
        console.log(rowID);
        runFunctions(rowID);
        lastId = rowID;
      }
    }
  });
}, 5000);

const {
  abbreviationText,
  addSubtitle,
  countWord,
  textInJson,
} = require("./index");
const sortWord = require("./sort/sort");
const addDB = require("./addInDB/addWordDB");

async function runFunctions(rowID) {
  try {
    await addSubtitle(rowID);
    console.log("Function 1");
  } catch (error) {
    console.error("Error in addSubtitle:", error);
    const mysqlQuery = `UPDATE user_history_youtube SET statusSub = ? WHERE user_history_youtube_id = "${rowID}"`;
    return db.query(mysqlQuery, ["noVideo", rowID], (err, result) => {
      if (err) throw err;
      console.log("Number of rows affected:", result.affectedRows);
    });
  }

  try {
    await textInJson(rowID);
    console.log("Function 2");
  } catch (error) {
    console.error("Error in textInJson:", error);

    const mysqlQuery = `UPDATE user_history_youtube SET statusSub = 'noSubtitle' WHERE user_history_youtube_id = "${rowID}"`;
    db.query(mysqlQuery, (err, result) => {
      if (err) throw err;
      console.log("Number of rows affected:", result.affectedRows);
    });
  }

  try {
    await abbreviationText(rowID);
    console.log("Function 3");
  } catch (error) {
    console.error("Error in abbreviationText:", error);
  }

  try {
    await countWord(rowID);
    console.log("Function 4");
  } catch (error) {
    console.error("Error in countWord:", error);
  }

  try {
    await sortWord(rowID);
    console.log("Function 5");
    const mysqlQuery = `UPDATE user_history_youtube SET statusSub = 'subtitleSaved' WHERE user_history_youtube_id = "${rowID}"`;
    db.query(mysqlQuery, (err, result) => {
      if (err) throw err;
      console.log("Number of rows affected:", result.affectedRows);
    });
  } catch (error) {
    console.error("Error in sortWord:", error);
  }

  // try {
  //   await addDB(rowID);
  //   console.log("ADD DB");
  //   const mysqlQuery = `UPDATE user_history_youtube SET statusSub = 'subtitleSaved' WHERE user_history_youtube_id = "${rowID}"`;
  //   db.query(mysqlQuery, (err, result) => {
  //     if (err) throw err;
  //     console.log("Number of rows affected:", result.affectedRows);
  //   });
  // } catch (error) {
  //   console.error("Error in addDB:", error);
  // }
}

//test function
// runFunctions("__eiQumLOEo");
