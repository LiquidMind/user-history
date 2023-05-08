const mysql2 = require("mysql2");
require("dotenv").config();
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

function addDB(objWord) {
  return new Promise((resolve, reject) => {
    const arrId = require(`../json_subtitle/${objWord}/count_${objWord}.json`);
    const arrIdWhole = require(`../json_subtitle/${objWord}/countWholeWords_${objWord}.json`);

    const arrOne = Object.entries(arrId);
    const arrOneWhole = Object.entries(arrIdWhole);

    const increaseByOne = 1;

    for (let i = 0; i < arrOne.length; i++) {
      const arrIndx = arrOne[i];

      const sql = `INSERT INTO stat__tokens_all (words, num_repetitions,numberOfVideos)
    VALUES ('${arrIndx[0]}', ${arrIndx[1]}, ${increaseByOne})
    ON DUPLICATE KEY UPDATE num_repetitions = num_repetitions + ${arrIndx[1]},numberOfVideos = numberOfVideos + ${increaseByOne};`;

      conection.execute(sql, arrIndx, function (err) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log("УСПІШНО ДОБАВЛЕНО");
          resolve();
        }
      });
    }
    for (let i = 0; i < arrOneWhole.length; i++) {
      const arrIndxWhole = arrOneWhole[i];

      // console.log(arrIndxWhole[0]);

      const sqlWhole = `INSERT INTO stat__words_all (words, num_repetitions,numberOfVideosWhole)
        VALUES ('${arrIndxWhole[0]}', ${arrIndxWhole[1]}, ${increaseByOne})
        ON DUPLICATE KEY UPDATE num_repetitions = num_repetitions + ${arrIndxWhole[1]},numberOfVideosWhole = numberOfVideosWhole + ${increaseByOne};`;

      conection.execute(sqlWhole, arrIndxWhole, function (err) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log("УСПІШНО ДОБАВЛЕНО");
          resolve();
        }
      });
    }
  });
}
// addDB("___lVbYXor8");
module.exports = addDB;
