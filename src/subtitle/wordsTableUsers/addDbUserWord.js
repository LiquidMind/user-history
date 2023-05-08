// const { sql } = require("googleapis/build/src/apis/sql");
// const { db } = require("../../model/dbConnection");

// function addDbUserWord(objWord, userID) {
//   try {
//     const arrIdWhole = require(`../json_subtitle/${objWord}/countWholeWords_${objWord}.json`);
//     const arrOneWhole = Object.entries(arrIdWhole);

//     console.log(arrOneWhole);
//     const increaseByOne = 1;
//     for (let i = 0; i < arrOneWhole.length; i++) {
//       const arrIndxWhole = arrOneWhole[i];

//       // console.log(arrIndxWhole[0]);

//       const sqlWhole = `INSERT INTO words_user_${userID} (words, number, numberOfVideo)
//             VALUES ('${arrIndxWhole[0]}', ${arrIndxWhole[1]}, ${increaseByOne})
//             ON DUPLICATE KEY UPDATE number = number + ${arrIndxWhole[1]},numberOfVideo = numberOfVideo + ${increaseByOne};`;

//       db.query(sqlWhole, arrIndxWhole, function (err) {
//         if (err) {
//           console.log(err);
//         } else {
//           const sqlQuery = `UPDATE videos_user_${userID} SET status = ? WHERE id = "${objWord}"`;
//           db.query(sqlQuery, ["saveWords", objWord], (err, result) => {
//             if (err) {
//               console.log(err);
//             } else {
//               console.log("УСПІШНО ДОБАВЛЕНО");
//             }
//           });
//         }
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     const sqlQuery = `UPDATE videos_user_${userID} SET status = ? WHERE id = "${objWord}"`;
//     db.query(sqlQuery, ["noWords", objWord], (err, result) => {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log("НЕМАЄ СЛІВ");
//       }
//     });
//   }

//   //   for (let i = 0; i < arrOne.length; i++) {
//   //     const arrIndx = arrOne[i];

//   //     const sql = `INSERT INTO stat_tokens_all (words, num_repetitions,numberOfVideos)
//   //     VALUES ('${arrIndx[0]}', ${arrIndx[1]}, ${increaseByOne})
//   //     ON DUPLICATE KEY UPDATE num_repetitions = num_repetitions + ${arrIndx[1]},numberOfVideos = numberOfVideos + ${increaseByOne};`;

//   //     db.query(sql, arrIndx, function (err) {
//   //       if (err) {
//   //         console.log(err);
//   //         reject(err);
//   //       } else {
//   //         // console.log("УСПІШНО ДОБАВЛЕНО");
//   //         resolve();
//   //       }
//   //     });
//   //   }
//   // for (let i = 0; i < arrOneWhole.length; i++) {
//   //   const arrIndxWhole = arrOneWhole[i];

//   //   // console.log(arrIndxWhole[0]);

//   //   const sqlWhole = `INSERT INTO words_user_${userID} (words, number, numberOfVideo)
//   //         VALUES ('${arrIndxWhole[0]}', ${arrIndxWhole[1]}, ${increaseByOne})
//   //         ON DUPLICATE KEY UPDATE number = number + ${arrIndxWhole[1]},numberOfVideo = numberOfVideo + ${increaseByOne};`;

//   //   db.query(sqlWhole, arrIndxWhole, function (err) {
//   //     if (err) {
//   //       console.log(err);
//   //       reject(err);
//   //     } else {
//   //       console.log("УСПІШНО ДОБАВЛЕНО");
//   //     }
//   //   });
//   // }
// }
// // addDbUserWord("___lVbYXors8");
// module.exports = addDbUserWord;

const { db } = require("../../model/dbConnection");

function addDbUserWord(objWord, userID) {
  return new Promise((resolve, reject) => {
    try {
      const arrIdWhole = require(`../json_subtitle/${objWord}/countWholeWords_${objWord}.json`);
      //vscode.dev/github/AndriyKozh/user-history/blob/main/src/subtitle/json_subtitle/0bJRwpCRkvQ
      https: console.log(arrIdWhole);
      const arrOneWhole = Object.entries(arrIdWhole);

      console.log(arrOneWhole);
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
            const sqlQuery = `UPDATE videos_user_${userID} SET status = ? WHERE id = "${objWord}"`;
            db.query(sqlQuery, ["saveWords", objWord], (err, result) => {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                console.log("УСПІШНО ДОБАВЛЕНО");
                resolve(); // розв'язуємо проміс при успішному виконанні запиту
              }
            });
          }
        });
      }
    } catch (err) {
      console.log(err);
      const sqlQuery = `UPDATE videos_user_${userID} SET status = ? WHERE id = "${objWord}"`;
      db.query(sqlQuery, ["noWords", objWord], (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log(" NO WORDS");
          resolve(); // розв'язуємо проміс при успішному виконанні запиту
        }
      });
    }
  });
}

module.exports = addDbUserWord;
