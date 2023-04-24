const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");
const emailNickName = require("../emailName/email");

const searchDir = "/Users/andrijkozevnikov/Downloads"; // Replace with the path to the directory where you want to search for the zip file.
const projectName = "myProject"; // Replace with your project name.
const projectPath =
  "/Users/andrijkozevnikov/Documents/ProjectYoutube/user-history/src/openZip/historyUsers";
const zipFileName = "takeout-20230424T082217Z-001.zip"; // Replace with the name of the zip file you want to find and extract.
const newFolderName = `${emailNickName}`; // Replace with the new name for the extracted folder.

// Function to search for a zip file recursively in a directory.
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

// Function to unzip and save the file in the project directory.
function unzipFile(zipPath, destination) {
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(destination, true); // 'true' to overwrite files if they already exist.
}

// Function to rename the extracted folder.
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

// Main logic
const zipPath = findZipFile(searchDir, zipFileName);

if (zipPath) {
  console.log(`Found zip file at: ${zipPath}`);
  unzipFile(zipPath, projectPath);
  renameExtractedFolder(projectPath, newFolderName);
  console.log(`Zip file extracted to: ${projectPath}`);
} else {
  console.log(
    `Zip file '${zipFileName}' not found in the specified directory.`
  );
}
