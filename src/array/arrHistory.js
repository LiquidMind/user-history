const fs = require("fs");

const emailNickName = require("../emailName/email");

let folderPath = `./src/openZip/historyUsers/${emailNickName}`;
let arrHistory = [];
let folderExists = false;

const processFolder = () => {
  if (fs.existsSync(folderPath)) {
    console.log(`Папка "${folderPath}" знайдена`);
    // Тут можна продовжити виконання вашого коду для цієї папки
    const arr = require(`../openZip/historyUsers/${emailNickName}/YouTube і YouTube Music/історія/історія переглядів.json`);
    arrHistory.push(...arr);
    console.log("Дані збережено в масив arrHistory");

    // Видалити папку
    fs.rmdirSync(folderPath, { recursive: true });
    console.log(`Папку "${folderPath}" видалено`);

    // Повторно запустити код на пошук папки
    folderExists = false;
    setTimeout(() => {
      processFolder();
    }, 1000); // спробувати знову через 1 секунду
  } else {
    console.log(`Папки "${folderPath}" не знайдено`);
    if (!folderExists) {
      const intervalId = setInterval(() => {
        if (fs.existsSync(folderPath)) {
          folderExists = true;
          console.log("Папка з'явилась!");
          clearInterval(intervalId);
          // Тут можна продовжити виконання вашого коду для нової папки
          processFolder();
        } else {
          console.log("Папки все ще не існує");
        }
      }, 1000); // перевіряти кожну секунду
    }
  }
};

processFolder();

// Тут ви можете продовжити виконання вашого коду після завершення функції з інтервалом

setTimeout(() => {
  console.log(arrHistory);
}, 5000); // вивести результат через 5 секунд

// const address = "test@.gmail.com";
// const user_name = address.replace(/[@.]/g, ""); //max190716ukrnet
// console.log(user_name);

module.exports = { arrHistory, emailNickName };
