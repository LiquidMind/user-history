const mysql2 = require("mysql2");
const arrayWords = require("../json_subtitle/allResult/test.json");
require("dotenv").config();

function allWord(resApp) {
  let spreadObj = {};
  for (let i = 0; i < resApp.length; i++) {
    spreadObj = { ...spreadObj, ...resApp[i] };
  }
  return spreadObj;
}

const addDB = [allWord(arrayWords)];
const result = Object.entries(addDB[0]).map(([key, value]) => [key, value]);
// console.log(addDB);

// const arrHistory = require("../array/arrHistory");

const { HOST, USER, DATABASE, PASSWORD } = process.env;

const conection = mysql2.createConnection({
  host: HOST,
  user: "root",
  database: DATABASE,
  password: PASSWORD,
});

//===================== table connection ============  watch_history - table =========

// conection.connect(function (err) {
//   if (err) {
//     return console.error("помилка" + err.message);
//   } else {
//     console.log("підключення успішне");
//   }
// });

// conection.execute("SELECT * FROM words", function (err, results) {
//   console.log(err);
//   console.log(results);
// });

// ================ ADD LINE INFO_HISTORY ==================

function resultArr(arrHistory) {
  for (let i = 0; i < arrHistory.length; i++) {
    const arrIndx = arrHistory[i];

    const sql = "INSERT INTO words (words,num_repetitions) VALUE (?,?)"; // watch_history - table

    conection.execute(sql, arrIndx, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("УСПІШНО ДОБАВЛЕНО");
      }
    });
  }
}

resultArr(result);
