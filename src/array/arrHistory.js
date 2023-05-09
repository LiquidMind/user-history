const fs = require("fs");
const path = require("path");
const addHistoryYoutube = require("../addHistoryYoutube/addHistoryYoutube");

// Функція historyArray обробляє історію переглядів YouTube для вказаного користувача
function historyArray(emailNickName) {
  console.log(emailNickName);
  // Шлях до теки з історією користувача
  const folderPath = path.join(
    __dirname,
    `../openZip/historyUsers/${emailNickName}`
  );
  let folderExists = false;
  // Функція processFolder перевіряє наявність теки та обробляє дані історії переглядів
  const processFolder = () => {
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
      addHistoryYoutube(arrHistory, emailNickName);
      console.log("Дані збережено в масиві arrHistory");
      // Видалити теку
      fs.rmdirSync(folderPath, { recursive: true });
      console.log(`Теку "${folderPath}" видалено`);
      // Запустити код знову для пошуку теки через 5 секунд
      setTimeout(() => {
        processFolder();
      }, 5000);
    } else {
      console.log(`Теки "${folderPath}" не знайдено`);
      // Якщо тека не існує, перевіряємо нові теки
      if (!folderExists) {
        const intervalId = setInterval(() => {
          if (fs.existsSync(folderPath)) {
            folderExists = true;
            console.log("Тека з'явилася!");
            clearInterval(intervalId);
            processFolder();
          } else {
            console.log(`Теки ${emailNickName} все ще не існує`);
          }
        }, 3000);
      }
    }
  };
  // Запустити функцію processFolder
  processFolder();
}

module.exports = { historyArray };
