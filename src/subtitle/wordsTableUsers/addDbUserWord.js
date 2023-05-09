const { db } = require("../../model/dbConnection");

function addDbUserWord(objWord, userID) {
  return new Promise((resolve, reject) => {
    const arrIdWhole = require(`../json_subtitle/${objWord}/countWholeWords_${objWord}.json`);
    //vscode.dev/github/AndriyKozh/user-history/blob/main/src/subtitle/json_subtitle/0bJRwpCRkvQ
    https: console.log(arrIdWhole);
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
          // const sqlQuery = `UPDATE videos_user_${userID} SET status = ? WHERE id = "${objWord}"`;
          // db.query(sqlQuery, ["saveWords", objWord], (err, result) => {
          //   if (err) {
          //     console.log(err);
          //     reject(err);
          //   } else {
          console.log("УСПІШНО ДОБАВЛЕНО");
          resolve(); // розв'язуємо проміс при успішному виконанні запиту
          //   }
          // });
        }
      });
    }

    // console.log(err);
    // const sqlQuery = `UPDATE videos_user_${userID} SET status = ? WHERE id = "${objWord}"`;
    // db.query(sqlQuery, ["noWords", objWord], (err, result) => {
    //   if (err) {
    //     console.log(err);
    //     reject(err);
    //   } else {
    console.log(" NO WORDS");
    resolve(); // розв'язуємо проміс при успішному виконанні запиту
    //   }
    // });
  });
}

module.exports = addDbUserWord;
