// const { db } = require("../../model/dbConnection");
// const fs = require("fs");
// const moment = require("moment");

// const removeEmojis = (str) => {
//   const cleanText = str.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "");
//   return cleanText;
// };

// const addHistoryAllDb = async (nameChannel, userId) => {
//   let str = `${nameChannel}`;
//   let match = str.match(/^([^@]*)/);
//   const category = match[0];

//   try {
//     const data = fs.readFileSync(
//       "/Users/andrijkozevnikov/Documents/ProjectYoutube/VirtualUsers/videos_user_" +
//         userId +
//         ".json",
//       "utf-8"
//     );
//     const jsonArray = JSON.parse(data);
//     console.log(jsonArray);

//     const createTableSQL = `
//       CREATE TABLE IF NOT EXISTS videos_user_${userId} (
//         id VARCHAR(20) PRIMARY KEY UNIQUE,
//         title VARCHAR(1000) NOT NULL,
//         titleUrl VARCHAR(255) NOT NULL,
//         timeDate DATETIME NOT NULL,
//         status ENUM('noSubtitles', 'saveWords', 'noWords', 'proces') NOT NULL DEFAULT 'proces'
//       )`;

//     db.query(createTableSQL, (err) => {
//       if (err) {
//         console.error(err);
//         return;
//       }
//     });

//     let prevTimeDate = moment(jsonArray[0].timeDate).format(
//       "YYYY-MM-DD HH:mm:ss"
//     );

//     for (let i = 0; i < jsonArray.length; i++) {
//       let item = jsonArray[i];
//       let timeDate;

//       if (i === 0) {
//         timeDate = prevTimeDate;
//       } else {
//         prevTimeDate = moment(prevTimeDate)
//           .add(1, "seconds")
//           .format("YYYY-MM-DD HH:mm:ss");
//         timeDate = prevTimeDate;
//       }

//       const cleanedTitle = removeEmojis(item.title);
//       const params = [item.id, cleanedTitle, item.titleUrl, timeDate, category];

//       const sqlAll =
//         "INSERT INTO videos_all (id, title, titleUrl, timeDate, category) VALUES (?,?,?,?,?)";
//       const sqlUser = `INSERT INTO videos_user_${userId} (id, title, titleUrl, timeDate, status) VALUES (?,?,?,?,'proces')`;

//       db.query(sqlAll, params, (err) => {
//         if (err) {
//           console.error(err);
//           return;
//         }
//       });

//       db.query(sqlUser, params, (err) => {
//         if (err) {
//           console.error(err);
//           return;
//         }
//       });
//     }

//     console.log("All data have been successfully added to the database");
//   } catch (err) {
//     console.error(err);
//   }
// };

// module.exports = addHistoryAllDb;

////////////////////////////////////////

const { db } = require("../../model/dbConnection");
const fs = require("fs");
const moment = require("moment");

const removeEmojis = (str) => {
  const cleanText = str.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "");
  return cleanText;
};

const addHistoryAllDb = async (nameChannel, userId) => {
  let str = `${nameChannel}`;
  let match = str.match(/^([^@]*)/);
  const category = match[0];

  try {
    const data = fs.readFileSync(
      "/Users/andrijkozevnikov/Documents/ProjectYoutube/VirtualUsers/videos_user_" +
        userId +
        ".json",
      "utf-8"
    );
    const jsonArray = JSON.parse(data);
    console.log(jsonArray);

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS videos_user_${userId} ( 
        id VARCHAR(20) PRIMARY KEY UNIQUE,
        title VARCHAR(1000) NOT NULL,
        titleUrl VARCHAR(255) NOT NULL,
        timeDate DATETIME NOT NULL,
        status ENUM('noSubtitles', 'saveWords', 'noWords', 'proces') NOT NULL DEFAULT 'proces'
      )`;

    db.query(createTableSQL, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });

    for (let i = 0; i < jsonArray.length; i++) {
      let item = jsonArray[i];
      let timeDate = moment().format("YYYY-MM-DD HH:mm:ss");

      const cleanedTitle = removeEmojis(item.title);
      const params = [item.id, cleanedTitle, item.titleUrl, timeDate, category];

      const sqlAll =
        "INSERT INTO videos_all (id, title, titleUrl, timeDate, category) VALUES (?,?,?,?,?)";
      const sqlUser = `INSERT INTO videos_user_${userId} (id, title, titleUrl, timeDate, status) VALUES (?,?,?,?,'proces')`;

      db.query(sqlAll, params, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });

      db.query(sqlUser, params, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }

    console.log("All data have been successfully added to the database");
  } catch (err) {
    console.error(err);
  }
};

module.exports = addHistoryAllDb;
