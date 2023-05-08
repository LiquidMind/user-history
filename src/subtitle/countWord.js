const natural = require("natural");
const fs = require("fs");
const tokenizer = new natural.WordTokenizer();

function countWord(arrHistory) {
  return new Promise((resolve, reject) => {
    const stemmer = natural.PorterStemmer;

    const folderPath = `./src/subtitle/json_subtitle/${arrHistory}`;
    const fileName = `count_${arrHistory}.json`;

    // const folderPathAll = `./src/subtitle/json_subtitle/allResult`;
    // const fileNameAll = "allResult.json";

    // abbreviatedWords
    const resultSubtitle = require(`./json_subtitle/${arrHistory}/next_${arrHistory}.json`);

    // wholeWords
    const fileNameWholeWords = `countWholeWords_${arrHistory}.json`;

    // wholeWords
    const resultWholeWords = require(`./json_subtitle/${arrHistory}/wholeWords_${arrHistory}.json`);

    // abbreviatedWords
    const text = resultSubtitle.join(" ");

    // wholeWords
    const wholeWordsText = resultWholeWords.join(" ");

    // Tokenize the text into individual words

    // abbreviatedWords
    const tokens = tokenizer.tokenize(text);

    // wholeWords
    const tokensWhole = tokenizer.tokenize(wholeWordsText);

    // Generate stems for each word
    // abbreviatedWords
    const stems = tokens.map((token) => stemmer.stem(token));

    // wholeWords
    const stemsWhole = tokensWhole.map((token) => stemmer.stem(token));

    // abbreviatedWords
    const stemFrequencies = stems.reduce((freqs, stem) => {
      freqs[stem] = (freqs[stem] || 0) + 1;
      return freqs;
    }, {});

    // wholeWords
    const stemWholeFrequencies = stemsWhole.reduce((freqs, stem) => {
      freqs[stem] = (freqs[stem] || 0) + 1;
      return freqs;
    }, {});

    // abbreviatedWords
    const dividedFrequencies = {};

    // wholeWords
    const dividedFrequenciesWhole = {};

    // abbreviatedWords
    Object.entries(stemFrequencies).map(([key, value]) => {
      dividedFrequencies[key] = Math.ceil(value / 3);
    });

    // wholeWords
    Object.entries(stemWholeFrequencies).map(([key, value]) => {
      dividedFrequenciesWhole[key] = Math.ceil(value / 3);
    });

    // wholeWords
    fs.writeFile(
      `${folderPath}/${fileNameWholeWords}`,
      JSON.stringify(dividedFrequenciesWhole),
      (err) => {
        if (err) {
          reject(err);
        } else {
          console.log("The file has been saved!");
          resolve();
        }
      }
    );

    // abbreviatedWords
    fs.writeFile(
      `${folderPath}/${fileName}`,
      JSON.stringify(dividedFrequencies),
      (err) => {
        if (err) {
          reject(err);
        } else {
          console.log("The file has been saved!");
          resolve();
        }
      }
    );

    // fs.appendFile(
    //   `${folderPathAll}/${fileNameAll}`,
    //   `${JSON.stringify(dividedFrequencies) + ","}`,
    //   (err) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       console.log("The file has been saved!");
    //       resolve();
    //     }
    //   }
    // );
  });
}
// countWord("3Ovayvsgb6g");
module.exports = countWord;

// // Завантаження необхідних модулів
// const natural = require("natural");
// const fs = require("fs");

// // Створення токенізатора
// const tokenizer = new natural.WordTokenizer();

// // Функція підрахунку слів
// function countWord(arrHistory) {
//   return new Promise((resolve, reject) => {
//     // Визначення стеммера
//     const stemmer = natural.PorterStemmer;

//     // Шляхи до файлів і папок
//     const folderPath = `./src/subtitle/json_subtitle/${arrHistory}`;
//     const fileName = `count_${arrHistory}.json`;
//     const folderPathAll = `./src/subtitle/json_subtitle/allResult`;
//     const fileNameAll = "allResult.json";

//     // Скорочені слова
//     const resultSubtitle = require(`./json_subtitle/${arrHistory}/next_${arrHistory}.json`);

//     // Повні слова
//     const fileNameWholeWords = `countWholeWords_${arrHistory}.json`;
//     const resultWholeWords = require(`./json_subtitle/${arrHistory}/wholeWords_${arrHistory}.json`);

//     // Об'єднання тексту
//     const text = resultSubtitle.join(" ");
//     const wholeWordsText = resultWholeWords.join(" ");

//     // Розбиття тексту на окремі слова
//     const tokens = tokenizer.tokenize(text);
//     const tokensWhole = tokenizer.tokenize(wholeWordsText);

//     // Створення стемів для кожного слова
//     const stems = tokens.map((token) => stemmer.stem(token));
//     const stemsWhole = tokensWhole.map((token) => stemmer.stem(token));

//     // Розрахунок частоти появи стемів
//     const stemFrequencies = stems.reduce((freqs, stem) => {
//       freqs[stem] = (freqs[stem] || 0) + 1;
//       return freqs;
//     }, {});

//     const stemWholeFrequencies = stemsWhole.reduce((freqs, stem) => {
//       freqs[stem] = (freqs[stem] || 0) + 1;
//       return freqs;
//     }, {});

//     // Розділені частоти
//     const dividedFrequencies = {};
//     const dividedFrequenciesWhole = {};

//     // Розрахунок розділених частот для скорочених слів
//     Object.entries(stemFrequencies).map(([key, value]) => {
//       dividedFrequencies[key] = Math.ceil(value / 3);
//     });

//     // Розрахунок розділених частот для повних слів
//     Object.entries(stemWholeFrequencies).map(([key, value]) => {
//       dividedFrequenciesWhole[key] = Math.ceil(value / 3);
//     });

//     // Запис результатів у файли
//     fs.writeFile(
//       `${folderPath}/${fileNameWholeWords}`,
//       JSON.stringify(dividedFrequenciesWhole),
//       (err) => {
//         if (err) {
//           reject(err);
//         } else {
//           console.log("Файл успішно збережено!");
//           resolve();
//         }
//       }
//     );

//     fs.writeFile(
//       `${folderPath}/${fileName}`,
// JSON.stringify(dividedFrequencies),
// (err) => {
// if (err) {
// reject(err);
// } else {
// console.log("Файл успішно збережено!");
// resolve();
// }
// }
// );
// Додавання результатів до файлу з усіма результатами
// fs.appendFile(
//   `${folderPathAll}/${fileNameAll}`,
//   `${JSON.stringify(dividedFrequencies) + ","}`,
//   (err) => {
//     if (err) {
//       reject(err);
//     } else {
//       console.log("Файл успішно збережено!");
//       resolve();
//     }
//   }
// );
// });
// }
