const fs = require("fs");

const { fileZipName } = require("../dataUser/dataUser");

const emailNickName = fileZipName;
console.log(emailNickName);

let folderPath = `./src/openZip/historyUsers/${emailNickName}`;
let arrHistory = [];

console.log(arrHistory);
let folderExists = false;

const processFolder = () => {
  if (fs.existsSync(folderPath)) {
    console.log(`Папка "${folderPath}" знайдена`);

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
    }, 5000); // спробувати знову через 1 секунду
  } else {
    console.log(`Папки "${folderPath}" не знайдено`);
    if (!folderExists) {
      const intervalId = setInterval(() => {
        if (fs.existsSync(folderPath)) {
          folderExists = true;
          console.log("Папка з'явилась!");
          clearInterval(intervalId);

          processFolder();
        } else {
          console.log(`Папки ${emailNickName} все ще не існує`);
        }
      }, 3000); // перевіряти кожну секунду
    }
  }
};

processFolder();

setTimeout(() => {
  console.log(arrHistory);
}, 5000); // вивести результат через 5 секунд

// const address = "test@.gmail.com";
// const user_name = address.replace(/[@.]/g, ""); //max190716ukrnet
// console.log(user_name);

module.exports = { arrHistory, emailNickName };
