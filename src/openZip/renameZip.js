const fs = require("fs");

function renameZipFile(fileZipName) {
  const nameNewFile = `${fileZipName}.zip`;
  const folderPath =
    "/Users/andrijkozevnikov/Documents/ProjectYoutube/downloadZIP/";

  function processFile() {
    fs.readdir(folderPath, function (err, files) {
      // Ваш код тут...
      if (err) {
        console.log("Помилка читання папки: " + err);
      } else {
        // Сортуємо файли за датою зміни
        files.sort(function (a, b) {
          return (
            fs.statSync(folderPath + b).mtime.getTime() -
            fs.statSync(folderPath + a).mtime.getTime()
          );
        });

        // Вибираємо останній файл, пропускаючи файли з непотрібними іменами
        let lastFile;
        for (let i = 0; i < files.length; i++) {
          if (files[i] !== ".DS_Store" && files[i] !== ".localized") {
            lastFile = files[i];
            break;
          }
        }

        // Перейменовуємо файл, пропускаючи файли з непотрібними іменами
        if (lastFile && lastFile !== ".DS_Store" && lastFile !== ".localized") {
          const oldFilename = lastFile;
          const newFilename = nameNewFile;
          fs.rename(
            folderPath + oldFilename,
            folderPath + newFilename,
            function (err) {
              if (err) {
                console.log("Помилка перейменування файлу: " + err);
              } else {
                console.log("Файл успішно перейменовано.");
              }
            }
          );
        } else {
          console.log("Не знайдено жодного відповідного файлу.");
        }
      }
    });
  }

  // Спостерігаємо за змінами в директорії

  fs.watch(folderPath, { persistent: true }, (eventType, filename) => {
    if (eventType === "create") {
      console.log(`Зміни в директорії: ${filename}`);
      processFile();
    }
  });

  // Очікуємо на появу файлу
  setInterval(() => {
    processFile();
  }, 3000);
}

module.exports = renameZipFile;
