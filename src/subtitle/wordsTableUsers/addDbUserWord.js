// const { db } = require("../../model/dbConnection");

// function addDbUserWord(objWord, userID) {
//   return new Promise((resolve, reject) => {
//     const arrIdWhole = require(`../json_subtitle/${objWord}/countWholeWords_${objWord}.json`);
//     //vscode.dev/github/AndriyKozh/user-history/blob/main/src/subtitle/json_subtitle/0bJRwpCRkvQ
//     https: console.log(arrIdWhole);
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

// module.exports = addDbUserWord;
////////////////////////////////////////////////////////////////////////
// const fs = require("fs");
// const csv = require("csv-parser");

// function addDbUserWord(objWord, userID) {
//   return new Promise((resolve, reject) => {
//     const csvFilePath = `/Users/andrijkozevnikov/Documents/ProjectYoutube/videos_files_words/files/${objWord}/words_frequencies_sorted.csv`;

//     const results = [];
//     const increaseByOne = 1;

//     fs.createReadStream(csvFilePath)
//       .pipe(csv({ headers: ["key", "value"] }))
//       .on("data", (data) => {
//         const key = data.key.trim();
//         const value = Number(data.value.trim());
//         results.push({ key, value });
//       })
//       .on("end", () => {
//         results.forEach((item) => {
//           const sqlWhole = `INSERT INTO words_user_${userID} (words, number, numberOfVideo)
//                 VALUES (?, ?, ?)
//                 ON DUPLICATE KEY UPDATE number = number + ?, numberOfVideo = numberOfVideo + ?`;

//           db.query(
//             sqlWhole,
//             [item.key, item.value, increaseByOne, item.value, increaseByOne],
//             function (err, result) {
//               if (err) {
//                 console.log(err);
//                 reject(err);
//               } else {
//                 console.log("УСПІШНО ДОБАВЛЕНО");
//               }
//             }
//           );
//         });
//         console.log("УСПІШНО ЗАВЕРШЕНО");
//         resolve();
//       });
//   });
// }

// // const id = "__zKg1IWYZA";
// // const usId = 12;
// // addDbUserWord(id, usId);
// module.exports = addDbUserWord;

//////////////////////////////////////////////////////

const fs = require("fs");
const { db } = require("../../model/dbConnection");
const csv = require("csv-parser");
const addDbWithJson = require("./addDbWithJson"); // Вкажіть шлях до модуля addDbWithJson тут

function addDbUserWord(objWord, userID) {
  return new Promise((resolve, reject) => {
    const csvFilePath = `/Users/andrijkozevnikov/Documents/ProjectYoutube/videos_files_words/files/${objWord}/words_frequencies_sorted.csv`;

    if (!fs.existsSync(csvFilePath)) {
      console.log("Файл не знайдено, запускаємо addDbWithJson");
      addDbWithJson(objWord, userID); // використайте відповідні аргументи згідно з вашими потребами
      resolve();
      return;
    }

    const results = [];
    const increaseByOne = 1;

    fs.createReadStream(csvFilePath)
      .pipe(csv({ headers: ["key", "value"] }))
      .on("data", (data) => {
        const key = data.key.trim();
        const value = Number(data.value.trim());
        results.push({ key, value });
      })
      .on("end", () => {
        results.forEach((item) => {
          const sqlWhole = `INSERT INTO words_user_${userID} (words, number, numberOfVideo)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE number = number + ?, numberOfVideo = numberOfVideo + ?`;

          db.query(
            sqlWhole,
            [item.key, item.value, increaseByOne, item.value, increaseByOne],
            function (err, result) {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                console.log("УСПІШНО ДОБАВЛЕНО");
              }
            }
          );
        });
        console.log("УСПІШНО ЗАВЕРШЕНО");
        resolve();
      });
  });
}

module.exports = addDbUserWord;
