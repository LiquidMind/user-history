const fs = require("fs");
const path = require("path");

const directoryPath =
  "/Users/andrijkozevnikov/Documents/ProjectYoutube/Archive/aipArchive"; // замініть на шлях до вашої папки

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.error("An error occurred:", err);
  }

  let oldestFile = { name: "", time: Infinity };

  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);

    fs.stat(filePath, (err, stats) => {
      if (err) {
        return console.error("An error occurred:", err);
      }

      if (stats.birthtime.getTime() < oldestFile.time) {
        oldestFile.name = file;
        oldestFile.time = stats.birthtime.getTime();
      }

      // Переконуємось, що ми виводимо ім'я найстарішого файлу лише після останнього виклику fs.stat
      if (file === files[files.length - 1]) {
        console.log(oldestFile.name);
      }
    });
  });
});
