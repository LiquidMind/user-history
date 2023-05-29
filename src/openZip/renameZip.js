const fs = require("fs");
const path = require("path");
const fg = require("fast-glob");

let previousFileZipName = null;
let timeoutId = null;
let intervalId = null;

function renameAndMoveZipFile(fileZipName) {
  if (previousFileZipName !== fileZipName) {
    if (timeoutId) clearTimeout(timeoutId);
    if (intervalId) clearInterval(intervalId);

    previousFileZipName = fileZipName;
    processFolder(fileZipName);
  }
}

async function processFolder(fileZipName) {
  try {
    console.log(fileZipName);

    const folderPath =
      "/Users/andrijkozevnikov/Documents/ProjectYoutube/downloadZIP/";
    const destinationFolder =
      "/Users/andrijkozevnikov/Documents/ProjectYoutube/historysZIP/";

    const nameNewFile = `${fileZipName}.zip`;

    if (fs.existsSync(folderPath)) {
      console.log(`Тека "${folderPath}" знайдена`);

      const searchPath = path.join(folderPath, "*.zip");

      const files = await fg(searchPath);

      const lastFile = files.sort(
        (a, b) =>
          fs.statSync(b).mtime.getTime() - fs.statSync(a).mtime.getTime()
      )[0];

      if (lastFile) {
        const newPath = path.join(folderPath, nameNewFile);
        fs.rename(lastFile, newPath, (err) => {
          if (err) {
            console.log("Помилка перейменування файлу: " + err);
          } else {
            console.log("Файл успішно перейменовано.");
            // moving the renamed file to a new location
            const finalPath = path.join(destinationFolder, nameNewFile);
            fs.rename(newPath, finalPath, (err) => {
              if (err) {
                console.log("Помилка переміщення файлу: " + err);
              } else {
                console.log("Файл успішно переміщено.");
              }
            });
          }
        });
      } else {
        console.log("Не знайдено жодного відповідного файлу.");
      }

      timeoutId = setTimeout(() => {
        processFolder(fileZipName);
      }, 5000);
    } else {
      console.log(`Теки "${folderPath}" не знайдено`);

      if (!intervalId) {
        intervalId = setInterval(() => {
          if (fs.existsSync(folderPath)) {
            console.log("Тека з'явилася!");
            clearInterval(intervalId);
            intervalId = null;
            processFolder(fileZipName);
          } else {
            console.log(`Теки ${fileZipName} все ще не існує`);
          }
        }, 3000);
      }
    }
  } catch (error) {
    console.log(`Помилка: ${error.message}`);
    console.log("Очікуємо на новий параметр для обробки");
  }
}

module.exports = renameAndMoveZipFile;
