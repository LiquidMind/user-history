const fs = require("fs");
const path = require("path");
require("dotenv").config();
const archiver = require("archiver");
const { db } = require("../../model/dbConnection");

function processVTTFile(vttFileName) {
  return new Promise((resolve, reject) => {
    const mysqlQuery = `SELECT language FROM videos_all WHERE id = "${vttFileName}";`;

    db.query(mysqlQuery, function res(err, result) {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      const languageVideo = result[0].language;
      const vttPath = `/Users/andrijkozevnikov/Documents/ProjectYoutube/videos_files_words/vtt/${vttFileName}.${languageVideo}.vtt`;
      const outputDir = `/Users/andrijkozevnikov/Documents/ProjectYoutube/videos_files_words/files/${vttFileName}`;

      if (!fs.existsSync(vttPath)) {
        console.log("VTT file not found:", vttPath);
        const noSubtitleQuery = `UPDATE videos_all SET statusSub = 'noSubtitle' WHERE id = "${vttFileName}"`;
        db.query(noSubtitleQuery, (err, result) => {
          if (err) {
            reject(err);
          } else {
            console.log("Status updated to 'noSubtitle'");
            resolve();
          }
        });
        return;
      }

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }

      const outputFilePath = `${outputDir}/${vttFileName}.srt`;
      const vttContent = fs.readFileSync(vttPath, "utf-8");
      const lines = vttContent.split("\n");
      let seenWords = new Set();

      let containsCTag = lines.some((line) => line.includes("<c>"));
      let newLines;

      if (containsCTag) {
        newLines = lines.filter((line) => {
          if (line.includes("<c>")) {
            return true;
          }
          let words = line.split(/\s+/).filter(Boolean);
          if (words.length === 1) {
            let word = words[0];
            if (!seenWords.has(word)) {
              seenWords.add(word);
              return true;
            }
          }
          return false;
        });
      } else {
        newLines = lines; // Якщо не має рядків з тегом <c>, збережемо весь текст
      }

      const srtContent = newLines.map((line) => `${line}\n`).join("\n");
      fs.writeFileSync(outputFilePath, srtContent, "utf-8");
      console.log("Lines have been saved to file:", outputFilePath);

      // Pack the VTT file into a ZIP if the SRT file was saved successfully
      const archivePath = path.join(
        "/Users/andrijkozevnikov/Documents/ProjectYoutube/videos_files_words/zip_vtt/",
        `${vttFileName}.zip`
      );
      const output = fs.createWriteStream(archivePath);
      const archive = archiver("zip", { zlib: { level: 9 } }); // Highest compression level

      output.on("close", () => {
        // Remove the original VTT file after archiving
        fs.unlink(vttPath, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      archive.on("error", (err) => reject(err));

      archive.pipe(output);
      archive.file(vttPath, { name: `${vttFileName}.vtt` });
      archive.finalize();
    });
  });
}

module.exports = processVTTFile;
