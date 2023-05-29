const fs = require("fs");
const path = require("path");
const fg = require("fast-glob");
const addHistoryYoutube = require("../addHistoryYoutube/addHistoryYoutube");

let previousParam = null;
let timeoutId = null;
let intervalId = null;

function arrHistory(newParam) {
  console.log(`ПАРАМЕТР ОЧІКУВАННЯ: ${newParam}`);

  if (previousParam !== newParam) {
    if (timeoutId) clearTimeout(timeoutId);
    if (intervalId) clearInterval(intervalId);

    previousParam = newParam;
    processFolder(newParam);
  }
}

async function processFolder(param) {
  try {
    console.log(param);

    const folderPath = path.join(__dirname, `../openZip/historyUsers/${param}`);
    let folderExists = false;

    if (fs.existsSync(folderPath)) {
      // console.log(`Тека "${folderPath}" знайдена`);

      const searchPath = path.join(folderPath, "**/*.json");

      const files = await fg(searchPath);

      let found = false;

      for (const file of files) {
        if (found) {
          break;
        }

        const data = await new Promise((resolve, reject) => {
          fs.readFile(file, "utf8", (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });

        const jsonContent = JSON.parse(data);

        if (
          Array.isArray(jsonContent) &&
          jsonContent.some((item) => item.hasOwnProperty("titleUrl"))
        ) {
          addHistoryYoutube(jsonContent, param);
          console.log("Дані збережено в масиві arrHistory");
          found = true;
        }
      }

      fs.rmdirSync(folderPath, { recursive: true });
      console.log(`Теку "${folderPath}" видалено`);

      timeoutId = setTimeout(() => {
        processFolder(param);
      }, 5000);
    } else {
      console.log(`Теки "${folderPath}" не знайдено`);

      if (!folderExists) {
        intervalId = setInterval(() => {
          if (fs.existsSync(folderPath)) {
            folderExists = true;
            console.log("Тека з'явилася!");
            clearInterval(intervalId);
            processFolder(param);
          } else {
            console.log(`Теки ${param} все ще не існує`);
          }
        }, 3000);
      }
    }
  } catch (error) {
    console.log(`Помилка: ${error.message}`);
    console.log("Очікуємо на новий параметр для обробки");
  }
}

module.exports = { arrHistory };
