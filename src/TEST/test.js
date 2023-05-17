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

//   addDbUserWord(userIdResult, userID);

//   const sqlQuery3 = `UPDATE videos_user_${userID} SET addWords = 1 WHERE id = "${videoID}"`;

//   try {
//     const result3 = await queryAsync(sqlQuery3);
//     console.log(result3);
//   } catch (err) {
//     console.error(err);
//     return;
//   }
// }
// const sqlQuery2 = `SELECT id FROM videos_user_2 WHERE addWords = 1 AND status = 'saveWords'`;

// db.query(sqlQuery2, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result);
// });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const util = require("util");
const { db } = require("../model/dbConnection");
const queryAsync = util.promisify(db.query).bind(db);

const userID = 11;
async function openID(userID) {
  const sqlQuery = `SHOW TABLES LIKE 'videos_user_${userID}'`;

  //   try {
  //     await addFolderWordsUser(userID); // викликаємо функцію addFolderWordsUser з await
  //     console.log("addFolderWordsUser completed successfully");
  //   } catch (error) {
  //     console.log("addFolderWordsUser failed with error:", error);
  //   }

  const result = await queryAsync(sqlQuery);

  if (result.length === 0) {
    console.log(`Table videos_user_${userID} not found`);
    return;
  }

  const sqlQuery2 = `SELECT videos_user_${userID}.id FROM videos_user_${userID} JOIN videos_all ON videos_user_${userID}.id = videos_all.id WHERE videos_all.statusSub = "subtitleSaved"`;

  const result2 = await queryAsync(sqlQuery2);

  console.log(result2);

  //   for (let i = 0; i < result2.length; i++) {
  //     const userObjId = result2[i];
  //     const userIdResult = Object.values(userObjId)[0];
  //     console.log(userIdResult);

  //     // await addDbUserWord(userIdResult, userID);

  //     const sqlQuery3 = `UPDATE videos_user_${userID} SET proces = 1 WHERE id = "${userIdResult}"`;

  //     try {
  //       const result3 = await queryAsync(sqlQuery3);
  //       console.log(result3);
  //     } catch (err) {
  //       console.error(err);
  //       return;
  //     }
  //   }
}

// main().catch((err) => console.error(err));

openID(userID);
main().catch((err) => console.error(err));

//============================================================   OPENZIP ===================

// Функція openZipFile виконує наступні дії:

// Перевіряє, чи fileZipName є новим параметром, щоб уникнути повторного виконання з тим же параметром. Якщо fileZipName є новим, функція processFolder викликається з цим параметром.

// У функції processFolder спочатку визначаються ряд констант, таких як шляхи до директорій, імена файлів та інші параметри.

// Визначається допоміжна функція getCurrentDateString, яка повертає поточну дату і час у форматі рядка.

// Визначаються функції для пошуку zip-файлу (findZipFile), розпакування zip-файлу (unzipFile), перейменування розпакованої папки (renameExtractedFolder), виконання дій при знаходженні zip-файлу (executeWhenZipFileAppears), переміщення zip-файлу (moveZipFile), створення папки, якщо вона не існує (createFolderIfNotExist) та моніторингу директорії на появу zip-файлу (monitorDirectory).

// Викликається функція executeWhenZipFileAppears. Якщо zip-файл знайдено, він розпаковується, розпакована папка перейменовується, а zip-файл переміщується в іншу папку. Якщо ж файл не знайдено, запускається моніторинг директорії.

// Якщо під час виконання коду виникає помилка, виводиться повідомлення про помилку та очікування нового параметра. Функція processFolder буде знову викликана з тим же параметром fileZipName через 5 секунд.

// Функція openZipFile експортується для використання в інших частинах коду.

// const fs = require("fs");
// const path = require("path");
// const AdmZip = require("adm-zip");

// let previousParam = null;
// let timeoutId = null;

// function openZipFile(fileZipName) {
//   if (previousParam !== fileZipName) {
//     if (timeoutId) clearTimeout(timeoutId);

//     previousParam = fileZipName;
//     processFolder(fileZipName);
//   }
// }

// async function processFolder(fileZipName) {
//   try {
//     const searchDir =
//       "/Users/andrijkozevnikov/Documents/ProjectYoutube/downloadZIP";
//     const projectPath =
//       "/Users/andrijkozevnikov/Documents/ProjectYoutube/user-history/src/openZip/historyUsers";
//     const zipFileName = `${fileZipName}.zip`;
//     const newFolderName = `${fileZipName}`;
//     const moveToDir =
//       "/Users/andrijkozevnikov/Documents/ProjectYoutube/Archive/zipFile_users";
//     const waitInterval = 5000;

//     function getCurrentDateString() {
//       const date = new Date();

//       const year = date.getFullYear();
//       const month = (date.getMonth() + 1).toString().padStart(2, "0");
//       const day = date.getDate().toString().padStart(2, "0");
//       const hours = date.getHours().toString().padStart(2, "0");
//       const minutes = date.getMinutes().toString().padStart(2, "0");
//       const seconds = date.getSeconds().toString().padStart(2, "0");

//       return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
//     }

//     function findZipFile(directory, zipName) {
//       const files = fs.readdirSync(directory);

//       for (const file of files) {
//         const filePath = path.join(directory, file);

//         if (fs.statSync(filePath).isDirectory()) {
//           const result = findZipFile(filePath, zipName);
//           if (result) {
//             return result;
//           }
//         } else if (file === zipName) {
//           return filePath;
//         }
//       }

//       return null;
//     }

//     function unzipFile(zipPath, destination) {
//       const zip = new AdmZip(zipPath);
//       zip.extractAllTo(destination, true);
//     }

//     function renameExtractedFolder(destination, newFolderName) {
//       const files = fs.readdirSync(destination);
//       const extractedFolder = files.find((file) =>
//         fs.statSync(path.join(destination, file)).isDirectory()
//       );

//       if (extractedFolder) {
//         const oldFolderPath = path.join(destination, extractedFolder);
//         const newFolderPath = path.join(destination, newFolderName);

//         fs.renameSync(oldFolderPath, newFolderPath);
//         console.log(`Extracted folder renamed to: ${newFolderPath}`);
//       } else {
//         console.log("No folder found to rename.");
//       }
//     }

//     function executeWhenZipFileAppears() {
//       const zipPath = findZipFile(searchDir, zipFileName);

//       if (zipPath) {
//         console.log(`Found zip file at: ${zipPath}`);
//         unzipFile(zipPath, projectPath);
//         renameExtractedFolder(projectPath, newFolderName);
//         moveZipFile(zipPath, moveToDir);
//         console.log(`Zip file extracted to: ${projectPath}`);
//         return true;
//       } else {
//         console.log(
//           `Zip file '${zipFileName}' not found in the specified
// directory.`
//         );
//         return false;
//       }
//     }

//     function moveZipFile(zipPath, destination) {
//       createFolderIfNotExist(destination, newFolderName);
//       const currentDate = getCurrentDateString();
//       const destinationPath = path.join(
//         destination,
//         newFolderName,
//         `${path.basename(zipPath, ".zip")}_${currentDate}.zip`
//       );
//       fs.renameSync(zipPath, destinationPath);
//       console.log(`Zip file moved to: ${destinationPath}`);
//     }

//     function createFolderIfNotExist(destination, folderName) {
//       const folderPath = path.join(destination, folderName);
//       if (!fs.existsSync(folderPath)) {
//         fs.mkdirSync(folderPath);
//         console.log(`Folder created: ${folderPath}`);
//       }
//     }

//     function monitorDirectory(directory, zipName) {
//       console.log(
//         `Monitoring directory '${directory}' for the appearance of '${zipName}'.`
//       );

//       const watcher = fs.watch(
//         directory,
//         { recursive: true },
//         (eventType, filename) => {
//           if (filename === zipName) {
//             watcher.close();
//             executeWhenZipFileAppears();
//           }
//         }
//       );
//     }

//     if (!executeWhenZipFileAppears()) {
//       monitorDirectory(searchDir, zipFileName);
//     }
//   } catch (error) {
//     console.log(`Error: ${error.message}`);
//     console.log("Waiting for a new parameter to process");
//     timeoutId = setTimeout(() => {
//       processFolder(fileZipName);
//     }, 5000);
//   }
// }

// module.exports = openZipFile;

// const sqlQuery = `SELECT va.id, va.lengthVideo
//         FROM videos_all AS va
//         WHERE va.id IN (SELECT vu.id FROM videos_user_6 AS vu)
//         ORDER BY va.lengthVideo DESC
//         LIMIT 50;
//         `;

// db.query(sqlQuery, (err, result) => {
//   const videoId = [];
//   if (err) {
//     console.log(err);
//   }
//   for (let i = 0; i < result.length; i++) {
//     const resObj = result[i];
//     const resID = Object.values(resObj)[0];
//     videoId.push(resID);
//   }

//   console.log(videoId);
// });

// function main() {
//   return new Promise((resolve, reject) => {
//     const encodedCode =
//       "4%2F0AbUR2VMc6chMxKvMSEeoPveJvgHcmrdveyepTfeg6ixQ--V8-6DhOymgPypKrGwfVuiMFg";
//     const code = decodeURIComponent(encodedCode);

//     console.log(code);
//     resolve(); // або reject() у разі помилки
//   });
// }

// main().catch((err) => console.error(err));
