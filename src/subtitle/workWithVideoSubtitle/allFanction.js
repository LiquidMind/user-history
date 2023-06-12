const { db } = require("../../model/dbConnection");
const {
  textInJson,
  createTxt,
  words,
  words_frequencies,
  stems,
  stems_frequencies,
  addSubtitle,
} = require("./index");

let lastId = null;

setInterval(() => {
  const mysqlQuery =
    "SELECT id FROM videos_all WHERE subtitleAdd = 'falce' AND viewes <> 0 ORDER BY viewes DESC LIMIT 0, 1;";

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
    } else {
      console.log("No matching value found in the database.");
    }
  });
}, 5000);

async function runFunctions(rowID) {
  try {
    await addSubtitle(rowID);
    console.log("Function 1");
  } catch (error) {
    console.error("Error in addSubtitle:", error);
    const mysqlQuery = `UPDATE videos_all SET statusSub = ? WHERE id = "${rowID}"`;
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
    // Обробка помилки для textInJson
    // ...
  }

  try {
    await createTxt(rowID);
    console.log("Function 4");
  } catch (error) {
    console.error("Error in createTxt:", error);
    // Обробка помилки для createTxt
    // ...
  }

  try {
    await words(rowID);
    console.log("Function 5");
  } catch (error) {
    console.error("Error in words:", error);
    // Обробка помилки для words
    // ...
  }

  try {
    await words_frequencies(rowID);
    console.log("Function 6");
  } catch (error) {
    console.error("Error in words_frequencies:", error);
    // Обробка помилки для words_frequencies
    // ...
  }

  try {
    await stems(rowID);
    console.log("Function 7");
  } catch (error) {
    console.error("Error in stems:", error);
    // Обробка помилки для stems
    // ...
  }

  try {
    const result = await stems_frequencies(rowID);
    if (result === false || result === 0) {
      throw new Error("stems_frequencies returned false or 0");
    }
    const mysqlQuery = `UPDATE videos_all SET statusSub = 'subtitleSaved' WHERE id = "${rowID}"`;
    db.query(mysqlQuery, (err, result) => {
      if (err) throw err;
      console.log("Number of rows affected:", result.affectedRows);
    });
    console.log("Function 8");
  } catch (error) {
    // ваш код для обробки помилки...
    console.error("Error in stems_frequencies:", error);
  }
}
