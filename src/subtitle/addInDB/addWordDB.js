// const mysql2 = require("mysql2");
// require("dotenv").config();
// const fs = require("fs");
// const csv = require("csv-parser");

// const { HOST, USER, DATABASE, PASSWORD } = process.env;

// const connection = mysql2.createConnection({
//   host: HOST,
//   user: "root",
//   database: DATABASE,
//   password: PASSWORD,
// });

// function addDB(objWord) {
//   return new Promise((resolve, reject) => {
//     const csvFilePath = `/Users/andrijkozevnikov/Documents/ProjectYoutube/videos_files_words/files/${objWord}/stems_frequencies_sorted.csv`;
//     const csvFilePathWhole = `/Users/andrijkozevnikov/Documents/ProjectYoutube/videos_files_words/files/${objWord}/words_frequencies_sorted.csv`;

//     const increaseByOne = 1;
//     const results = [];
//     const resultsWhole = [];

//     fs.createReadStream(csvFilePath)
//       .pipe(csv({ headers: ["key", "value"] }))
//       .on("data", (data) => {
//         const key = data.key.trim();
//         const value = Number(data.value.trim());
//         results.push({ key, value }); // Зміна тут
//       })
//       .on("end", () => {
//         results.forEach((item) => {
//           const sql = `INSERT INTO stat__tokens_all (words, num_repetitions, numberOfVideos) VALUES (?, ?, ?)
//                       ON DUPLICATE KEY UPDATE num_repetitions = num_repetitions + ?, numberOfVideos = numberOfVideos + ?`;
//           connection.execute(
//             sql,
//             [item.key, item.value, increaseByOne, item.value, increaseByOne],
//             function (err) {
//               if (err) {
//                 console.log(err);
//                 reject(err);
//               } else {
//                 console.log("VIDEOS ADD");
//               }
//             }
//           );
//         });
//         console.log("Перший CSV файл успішно оброблено");
//       });

//     fs.createReadStream(csvFilePathWhole)
//       .pipe(csv({ headers: ["key", "value"] }))
//       .on("data", (data) => {
//         const key = data.key.trim();
//         const value = Number(data.value.trim());
//         resultsWhole.push({ key, value }); // Зміна тут
//       })
//       .on("end", () => {
//         resultsWhole.forEach((item) => {
//           const sqlWhole = `INSERT INTO stat__words_all (words, num_repetitions, numberOfVideosWhole) VALUES (?, ?, ?)
//                           ON DUPLICATE KEY UPDATE num_repetitions = num_repetitions + ?, numberOfVideosWhole = numberOfVideosWhole + ?`;
//           connection.execute(
//             sqlWhole,
//             [item.key, item.value, increaseByOne, item.value, increaseByOne],
//             function (err) {
//               if (err) {
//                 console.log(err);
//                 reject(err);
//               } else {
//                 console.log("УСПІШНО ДОБАВЛЕНО");
//               }
//             }
//           );
//         });
//         console.log("Другий CSV файл успішно оброблено");
//         resolve();
//       });
//   });
// }

// module.exports = addDB;
////////////////////////////////////
const mysql2 = require("mysql2");
require("dotenv").config();
const fs = require("fs");
const csv = require("csv-parser");

const { HOST, USER, DATABASE, PASSWORD } = process.env;

const connection = mysql2.createConnection({
  host: HOST,
  user: "root",
  database: DATABASE,
  password: PASSWORD,
});

function addDB(objWord) {
  return new Promise((resolve, reject) => {
    const csvFilePath = `/Users/andrijkozevnikov/Documents/ProjectYoutube/videos_files_words/files/${objWord}/stems_frequencies_sorted.csv`;
    const csvFilePathWhole = `/Users/andrijkozevnikov/Documents/ProjectYoutube/videos_files_words/files/${objWord}/words_frequencies_sorted.csv`;

    const jsonFilePath = `../json_subtitle/${objWord}/countWholeWords_${objWord}.json`;
    const jsonFilePathWhole = `./json_subtitle/${objWord}/count___a0uV72Ul4.json`;

    const increaseByOne = 1;
    let results = [];
    let resultsWhole = [];

    if (fs.existsSync(csvFilePath)) {
      fs.createReadStream(csvFilePath)
        .pipe(csv({ headers: ["key", "value"] }))
        .on("data", (data) => {
          const key = data.key.trim();
          const value = Number(data.value.trim());
          results.push({ key, value });
        })
        .on("end", () => {
          results.forEach((item) => {
            const sql = `INSERT INTO stat__tokens_all (words, num_repetitions, numberOfVideos) VALUES (?, ?, ?)
                        ON DUPLICATE KEY UPDATE num_repetitions = num_repetitions + ?, numberOfVideos = numberOfVideos + ?`;
            connection.execute(
              sql,
              [item.key, item.value, increaseByOne, item.value, increaseByOne],
              function (err) {
                if (err) {
                  console.log(err);
                  reject(err);
                } else {
                  console.log("VIDEOS ADD");
                }
              }
            );
          });
          console.log("Перший CSV файл успішно оброблено");
        });
    } else if (fs.existsSync(jsonFilePath)) {
      const data = require(jsonFilePath);
      results = Object.keys(data).map((key) => ({ key, value: 1 }));
      // Обробка даних з JSON
    } else {
      console.log("CSV або JSON файл не знайдено");
      reject("CSV або JSON файл не знайдено");
    }

    if (fs.existsSync(csvFilePathWhole)) {
      fs.createReadStream(csvFilePathWhole)
        .pipe(csv({ headers: ["key", "value"] }))
        .on("data", (data) => {
          const key = data.key.trim();
          const value = Number(data.value.trim());
          resultsWhole.push({ key, value });
        })
        .on("end", () => {
          resultsWhole.forEach((item) => {
            const sqlWhole = `INSERT INTO stat__words_all (words, num_repetitions, numberOfVideosWhole) VALUES (?, ?, ?)
                            ON DUPLICATE KEY UPDATE num_repetitions = num_repetitions + ?, numberOfVideosWhole = numberOfVideosWhole + ?`;
            connection.execute(
              sqlWhole,
              [item.key, item.value, increaseByOne, item.value, increaseByOne],
              function (err) {
                if (err) {
                  console.log(err);
                  reject(err);
                } else {
                  console.log("УСПІШНО ДОБАВЛЕНО");
                }
              }
            );
          });
          console.log("Другий CSV файл успішно оброблено");
          resolve();
        });
    } else if (fs.existsSync(jsonFilePathWhole)) {
      const dataWhole = require(jsonFilePathWhole);
      resultsWhole = Object.keys(dataWhole).map((key) => ({ key, value: 1 }));
      // тут може бути додатковий код для обробки даних з JSON
    } else {
      console.log("CSV або JSON файл не знайдено");
      reject("CSV або JSON файл не знайдено");
    }
  });
}

module.exports = addDB;
