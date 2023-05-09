const fs = require("fs");
const path = require("path");
const addHistoryYoutube = require("../addHistoryYoutube/addHistoryYoutube");

let previousParam = null;
let timeoutId = null;
let intervalId = null;

// Функція historyArray обробляє історію переглядів YouTube для вказаного користувача
function historyArray(newParam) {
  if (previousParam !== newParam) {
    // Очистити попередні таймаути і інтервали
    if (timeoutId) clearTimeout(timeoutId);
    if (intervalId) clearInterval(intervalId);

    previousParam = newParam;
    processFolder(newParam);
  }
}

function processFolder(param) {
  try {
    console.log(param);

    // Шлях до теки з історією користувача
    const folderPath = path.join(__dirname, `../openZip/historyUsers/${param}`);
    let folderExists = false;

    // Якщо тека існує
    if (fs.existsSync(folderPath)) {
      console.log(`Тека "${folderPath}" знайдена`);
      // Завантажити дані історії переглядів із файлу JSON
      const arr = require(path.join(
        folderPath,
        "/YouTube і YouTube Music/історія/історія переглядів.json"
      ));
      // Додати дані історії переглядів в масив arrHistory
      const arrHistory = [...arr];
      addHistoryYoutube(arrHistory, param);
      console.log("Дані збережено в масиві arrHistory");
      // Видалити теку
      fs.rmdirSync(folderPath, { recursive: true });
      console.log(`Теку "${folderPath}" видалено`);
      // Запустити код знову для пошуку теки через 5 секунд
      timeoutId = setTimeout(() => {
        processFolder(param);
      }, 5000);
    } else {
      console.log(`Теки "${folderPath}" не знайдено`);
      // Якщо тека не існує, перевіряємо нові теки
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

module.exports = { historyArray };
