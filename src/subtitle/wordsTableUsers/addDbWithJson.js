// const { db } = require("../../model/dbConnection");

// function addDbWithJson(objWord, userID) {
//   return new Promise((resolve, reject) => {
//     const arrIdWhole = require(`../json_subtitle/${objWord}/countWholeWords_${objWord}.json`);
//     //vscode.dev/github/AndriyKozh/user-history/blob/main/src/subtitle/json_subtitle/0bJRwpCRkvQ
//     console.log(arrIdWhole);
//     const arrOneWhole = Object.entries(arrIdWhole);

//     const increaseByOne = 1;
//     for (let i = 0; i < arrOneWhole.length; i++) {
//       const arrIndxWhole = arrOneWhole[i];

//       const sqlWhole = `INSERT INTO words_user_${userID} (words, number, numberOfVideo)
//           VALUES ('${arrIndxWhole[0]}', ${arrIndxWhole[1]}, ${increaseByOne})
//           ON DUPLICATE KEY UPDATE number = number + ${arrIndxWhole[1]},numberOfVideo = numberOfVideo + ${increaseByOne};`;

//       db.query(sqlWhole, arrIndxWhole, function (err, result) {
//         if (err) {
//           console.log(err);
//           reject(err);
//         } else {
//           console.log("УСПІШНО ДОБАВЛЕНО");
//           resolve(); // розв'язуємо проміс при успішному виконанні запиту
//         }
//       });
//     }

//     console.log(" NO WORDS");
//     resolve(); // розв'язуємо проміс при успішному виконанні запиту
//   });
// }

// module.exports = addDbWithJson;

const { db } = require("../../model/dbConnection");
const fs = require("fs");
const path = require("path");

function addDbWithJson(objWord, userID) {
  return new Promise((resolve, reject) => {
    const jsonFilePath = path.join(
      __dirname,
      `../json_subtitle/${objWord}/countWholeWords_${objWord}.json`
    );

    if (!fs.existsSync(jsonFilePath)) {
      console.log("JSON файл не знайдено, оновлюємо videos_all");
      const sqlUpdate = `UPDATE videos_all SET subtitleAdd = 0, statusSub = 'proces' WHERE id = ?`;
      db.query(sqlUpdate, [objWord], function (err, result) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log("УСПІШНО ОНОВЛЕНО");
          resolve();
        }
      });
      return;
    }

    const arrIdWhole = require(jsonFilePath);
    console.log(arrIdWhole);
    const arrOneWhole = Object.entries(arrIdWhole);

    const increaseByOne = 1;
    for (let i = 0; i < arrOneWhole.length; i++) {
      const arrIndxWhole = arrOneWhole[i];

      const sqlWhole = `INSERT INTO words_user_${userID} (words, number, numberOfVideo)
          VALUES ('${arrIndxWhole[0]}', ${arrIndxWhole[1]}, ${increaseByOne})
          ON DUPLICATE KEY UPDATE number = number + ${arrIndxWhole[1]},numberOfVideo = numberOfVideo + ${increaseByOne};`;

      db.query(sqlWhole, arrIndxWhole, function (err, result) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log("УСПІШНО ДОБАВЛЕНО");
        }
      });
    }

    console.log("ОПЕРАЦІЮ ЗАВЕРШЕНО");
    resolve();
  });
}

module.exports = addDbWithJson;
