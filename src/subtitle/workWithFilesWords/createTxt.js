// const fs = require("fs");

// function processSRTFile(srtFilePath) {
//   const filePath = `/Users/andrijkozevnikov/Documents/ProjectYoutube/videos_files_words/files/${srtFilePath}/${srtFilePath}.srt`;

//   return new Promise((resolve, reject) => {
//     fs.readFile(filePath, "utf8", (err, data) => {
//       if (err) {
//         reject(err);
//         return;
//       }

//       const cleanedText = data.replace(/<c>|<\/c>|<\/?.+?>/gi, "");

//       let words = cleanedText.match(/[a-zA-Zа-яА-ЯіїєІЇЄ']+/g);

//       // Конвертуємо всі слова в нижній регістр
//       words = words.map((word) => word.toLowerCase());

//       const excludedWords = [
//         "webvtt",
//         "captions",
//         "start",
//         "kind",
//         "position",
//         "align",
//         "ru",
//         "en",
//         "ua",
//         "language",
//         "c",
//         "nbsp",
//       ];

//       // Виключаємо деякі слова зі списку
//       words = words.filter((word) => !excludedWords.includes(word));

//       const txtFilePath = filePath.replace(".srt", ".txt");

//       fs.writeFile(txtFilePath, words.join(" "), (err) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(txtFilePath);
//         }
//       });
//     });
//   });
// }

// module.exports = processSRTFile;

///////////////////////////////////////////
const fs = require("fs");

async function createTxt(rowID) {
  const filePath = `/Users/andrijkozevnikov/Documents/ProjectYoutube/videos_files_words/files/${rowID}/${rowID}.srt`;

  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const cleanedText = data.replace(/<c>|<\/c>|<\/?.+?>/gi, "");

        let words = cleanedText.match(/[a-zA-Zа-яА-ЯіїєІЇЄ']+/g);

        if (words === null) {
          throw new Error("Слова не знайдені у тексті");
        }

        words = words.map((word) => word.toLowerCase());

        const excludedWords = [
          "webvtt",
          "captions",
          "start",
          "kind",
          "position",
          "align",
          "ru",
          "en",
          "ua",
          "language",
          "c",
          "nbsp",
        ];

        words = words.filter((word) => !excludedWords.includes(word));

        const txtFilePath = filePath.replace(".srt", ".txt");

        fs.writeFile(txtFilePath, words.join(" "), (err) => {
          if (err) {
            reject(err);
          } else {
            console.log(`Lines have been saved to file: ${txtFilePath}`);
            resolve(txtFilePath);
          }
        });
      } catch (error) {
        console.error("Помилка при обробці тексту:", error);
        resolve(null);
      }
    });
  });
}
// const id = "5hb-8H1qhjs";
// createTxt(id);

module.exports = createTxt;
