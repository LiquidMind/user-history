// addFolderWordsUser

// const { db } = require("./model/dbConnection");
// const fs = require("fs");

// const addWordFoundUser = async (idUser) => {
//   return new Promise(async (resolve, reject) => {
//     const directory = `/Users/andrijkozevnikov/Documents/ProjectYoutube/Archive/users_wordFolder/user_${idUser}`;

//     fs.mkdir(directory, { recursive: true }, (err) => {
//       if (err) {
//         console.error(err);
//         reject(err);
//       } else {
//         console.log(`Directory ${directory} created successfully`);
//       }
//     });

//     const sqlQuery = `SELECT id FROM videos_user_${idUser} WHERE status = "saveWords" AND statusWords = false`;
//     db.query(sqlQuery, async (err, result) => {
//       if (err) {
//         console.log(err);
//         reject(err);
//       } else if (result.length === 0) {
//         const error = new Error(`Table videos_user_${idUser} not found`);
//         console.log(error);
//         reject(error);
//       } else {
//         for (let i = 0; i < result.length; i++) {
//           const resObj = result[i];
//           const resID = Object.values(resObj)[0];
//           ///////////////////////////

//           const objWord = require(`./subtitle/json_subtitle/${resID}/countWholeWords_${resID}.json`);

//           // // Convert the object to an array of key-value pairs
//           const arrays = Object.entries(objWord);

//           function createDir(path, numb) {
//             // Split the path into individual directories using slashes
//             const parts = path.split("/");
//             // Add the ".txt" extension to the last directory name to create the filename
//             const filename = parts.pop() + ".txt";

//             // Loop through the directories array and create each directory if it does not already exist
//             for (let i = 1; i <= parts.length; i++) {
//               const subPath =
//                 `/Users/andrijkozevnikov/Documents/ProjectYoutube/Archive/users_wordFolder/user_${idUser}` +
//                 "/" + // Add a path separator
//                 parts.slice(0, i).join("/");
//               console.log(subPath);
//               if (!fs.existsSync(subPath)) {
//                 fs.mkdirSync(subPath);
//               }
//             }

//             // Create the full path to the file by combining the directories array and the filename
//             const filePath =
//               `/Users/andrijkozevnikov/Documents/ProjectYoutube/Archive/users_wordFolder/user_${idUser}` +
//               "/" + // Add a path separator
//               parts.join("/") +
//               "/" +
//               filename;

//             // Check if the file exists and write the key-value pair to it
//             if (!fs.existsSync(filePath)) {
//               fs.writeFileSync(filePath, `${resID}:${numb},`);
//             } else {
//               fs.appendFileSync(filePath, `${resID}:${numb},`);
//             }
//           }

//           // Loop through the key-value pairs array and call the createDir function for each of them
//           for (let i = 0; i < arrays.length; i++) {
//             const [a, b] = arrays[i];

//             // Split the key into individual letters to create the directory structure
//             const letters = a.split("").join("/");

//             // Call the createDir function with the directory path and the value as arguments

//             createDir(letters, b);
//           }

//           // SET THE statusWords FLAG TO 1 WHEN FINISHED

//           const sqlQuery = `UPDATE videos_user_${idUser} SET statusWords = 1 WHERE id = "${resID}"`;
//           db.query(sqlQuery, (err, result) => {
//             if (err) {
//               console.log(err);
//             }
//             console.log("statusWords CHANGED");
//           });

//           console.log(`VIDEO_ID: ${resID}`);

//           // Introduce a delay of 3 seconds between each iteration
//           await new Promise((resolve) => setTimeout(resolve, 500));
//         }
//         resolve(); // resolve the promise when the query is successful
//       }
//     });
//   });
// };

// module.exports = addWordFoundUser;

//==========================================

// const sqlQuery = `SELECT videos_user_3.id FROM videos_user_3 JOIN videos_all ON videos_user_3.id = videos_all.id WHERE videos_all.statusSub = "subtitleSaved"`;

// db.query(sqlQuery, (err, result) => {
//   if (err) {
//     console.log(err);
//   } else {
//     for (let i = 0; i < result.length; i++) {
//       const resultObj = result[i];
//       const videoID = Object.values(resultObj)[0];
//       console.log(videoID);
//     }
//   }
// });

// const { sql } = require("googleapis/build/src/apis/sql");
// const { db } = require("./model/dbConnection");
// const util = require("util");
// const queryAsync = util.promisify(db.query).bind(db);

// const sqlQuery2 = `SELECT videos_user_3.id FROM videos_user_3 JOIN videos_all ON videos_user_3.id = videos_all.id WHERE videos_all.statusSub = "subtitleSaved"`;

// const result2 = queryAsync(sqlQuery2);

// for (let i = 0; i < result2.length; i++) {
//   const userObjId = result2[i];
//   const videoID = Object.values(userObjId)[0];
//   console.log(userObjId);

// addDbUserWord(userIdResult, userID);

// const sqlQuery3 = `UPDATE videos_user_${userID} SET addWords = 1 WHERE id = "${videoID}"`;

// try {
//   const result3 = await queryAsync(sqlQuery3);
//   console.log(result3);
// } catch (err) {
//   console.error(err);
//   return;
// }
// }
// const sqlQuery2 = `SELECT id FROM videos_user_2 WHERE addWords = 1 AND status = 'saveWords'`;

// db.query(sqlQuery2, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result);
// });
