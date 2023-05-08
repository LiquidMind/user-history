const mysql2 = require("mysql2");

require("dotenv").config();

// const { arrHistory } = require("../array/arrHistory");
// const arrHistory = "dii.iskra@gmail.com";

const { HOST, USER, DATABASE, PASSWORD } = process.env;

const connection = mysql2.createConnection({
  host: "localhost",
  user: "root",
  database: DATABASE,
  password: PASSWORD,
});

//===================== table connection ============  watch_history - table =========

// connection.connect(function (err) {
//   if (err) {
//     return console.error("помилка" + err.message);
//   } else {
//     console.log("підключення успішне");
//   }
// });

// connection.execute(
//   "SELECT * FROM user_history_youtube",
//   function (err, results) {
//     console.log(err);
//     console.log(results);
//   }
// );

// ================ ADD LINE INFO_HISTORY ==================

const history = [];

function addHistoryYoutube(arrHistory, emailUser) {
  console.log(arrHistory);
  for (let i = 0; i < arrHistory.length; i++) {
    const arrIndx = arrHistory[i];

    const titleUrl = arrIndx.titleUrl;
    // console.log(titleUrl);

    const time = arrIndx.time.split("");
    const timeOne = time.splice(10, 1, " ");
    const timeTwo = time.join("");
    const dateWathVideo = timeTwo.slice(0, 18);

    const titles = arrIndx.title;
    const titleVideo = titles.slice(18);

    if (titleUrl) {
      const id = titleUrl?.slice(32, 47);
      history.push([id, titleVideo, titleUrl, dateWathVideo]);
    } else {
      continue;
    }
  }

  connection.execute(
    `SELECT id FROM google_test WHERE google_email = "${emailUser}" `,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        const objId = result[0];
        const userId = Object.values(objId)[0];
        console.log(userId);

        connection.query(
          `CREATE TABLE IF NOT EXISTS videos_user_${userId} ( 
    id VARCHAR(20) PRIMARY KEY,
    title VARCHAR(1000) NOT NULL,
    titleUrl VARCHAR(255) NOT NULL,
    timeDate DATETIME NOT NULL,
    status ENUM('saveWords', 'noWords', 'proces') NOT NULL DEFAULT 'proces',
  )`,
          (error, results, fields) => {
            if (error) {
              console.error("Помилка створення таблиці:", error);
              return;
            }
            console.log("Таблицю оновлено успішно!");
          }
        );

        for (let i = 0; i < history.length; i++) {
          const a = history[i];
          console.log(a);

          const sql = `INSERT INTO videos_user_${userId}  (id, title, titleUrl, timeDate) VALUE (?,?,?,?)`; // watch_history - table

          connection.execute(sql, a, function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log("VIDEO USER ADD");
            }
          });
        }
        for (let i = 0; i < history.length; i++) {
          const a = history[i];
          console.log(a);

          const sql =
            "INSERT INTO videos_all (id, title, titleUrl, timeDate) VALUE (?,?,?,?)"; // watch_history - table

          connection.execute(sql, a, function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log("УСПІШНО ДОБАВЛЕНО");
            }
          });
        }
      }
    }
  );
}
module.exports = addHistoryYoutube;

// resultArr(arrHistory, emailNickName);
