const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

function openZipFile(fileZipName) {
  const searchDir =
    "/Users/andrijkozevnikov/Documents/ProjectYoutube/downloadZIP";
  const projectPath =
    "/Users/andrijkozevnikov/Documents/ProjectYoutube/user-history/src/openZip/historyUsers";
  const zipFileName = `${fileZipName}.zip`;
  const newFolderName = `${fileZipName}`;
  const moveToDir =
    "/Users/andrijkozevnikov/Documents/ProjectYoutube/Archive/zipFile_users";
  const waitInterval = 5000;

  // Функція для отримання поточної дати у форматі рядка "YYYY-MM-DD"

  function getCurrentDateString() {
    const date = new Date();

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  // Функція для пошуку zip-файлу в заданій директорії
  function findZipFile(directory, zipName) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
      const filePath = path.join(directory, file);

      if (fs.statSync(filePath).isDirectory()) {
        const result = findZipFile(filePath, zipName);
        if (result) {
          return result;
        }
      } else if (file === zipName) {
        return filePath;
      }
    }

    return null;
  }

  // Функція для розпакування zip-файлу
  function unzipFile(zipPath, destination) {
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(destination, true);
  }

  // Функція для перейменування розпакованої папки
  function renameExtractedFolder(destination, newFolderName) {
    const files = fs.readdirSync(destination);
    const extractedFolder = files.find((file) =>
      fs.statSync(path.join(destination, file)).isDirectory()
    );

    if (extractedFolder) {
      const oldFolderPath = path.join(destination, extractedFolder);
      const newFolderPath = path.join(destination, newFolderName);

      fs.renameSync(oldFolderPath, newFolderPath);
      console.log(`Extracted folder renamed to: ${newFolderPath}`);
    } else {
      console.log("No folder found to rename.");
    }
  }

  // Функція для виконання дій, коли з'явиться zip-файл
  function executeWhenZipFileAppears() {
    const zipPath = findZipFile(searchDir, zipFileName);

    if (zipPath) {
      console.log(`Found zip file at: ${zipPath}`);
      unzipFile(zipPath, projectPath);
      renameExtractedFolder(projectPath, newFolderName);
      moveZipFile(zipPath, moveToDir);
      console.log(`Zip file extracted to: ${projectPath}`);
      return true;
    } else {
      console.log(
        `Zip file '${zipFileName}' not found in the specified directory.`
      );
      return false;
    }
  }

  // Функція для переміщення zip-файлу в нову папку
  // Зміна функції moveZipFile для включення дати в назві збереженого файлу
  function moveZipFile(zipPath, destination) {
    createFolderIfNotExist(destination, newFolderName);
    const currentDate = getCurrentDateString();
    const destinationPath = path.join(
      destination,
      newFolderName,
      `${path.basename(zipPath, ".zip")}_${currentDate}.zip`
    );
    fs.renameSync(zipPath, destinationPath);
    console.log(`Zip file moved to: ${destinationPath}`);
  }

  // Функція для створення папки, якщо вона не існує
  function createFolderIfNotExist(destination, folderName) {
    const folderPath = path.join(destination, folderName);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
      console.log(`Folder created: ${folderPath}`);
    }
  }

  // Функція для моніторингу директорії на появу zip-файлу
  function monitorDirectory(directory, zipName) {
    console.log(
      `Monitoring directory '${directory}' for the appearance of '${zipName}'.`
    );

    const watcher = fs.watch(
      directory,
      { recursive: true },
      (eventType, filename) => {
        if (filename === zipName) {
          watcher.close();
          executeWhenZipFileAppears();
        }
      }
    );
  }

  // Виконати функцію executeWhenZipFileAppears, якщо zip-файл знайдено
  if (!executeWhenZipFileAppears()) {
    monitorDirectory(searchDir, zipFileName);
  }
}

module.exports = openZipFile;
// ============================
