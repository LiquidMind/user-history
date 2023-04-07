const natural = require("natural");
const fs = require("fs");
const tokenizer = new natural.WordTokenizer();

function countWord(arrHistory) {
  return new Promise((resolve, reject) => {
    const stemmer = natural.PorterStemmer;

    const folderPath = `./src/subtitle/json_subtitle/${arrHistory}`;
    const fileName = `count_${arrHistory}.json`;

    const folderPathAll = `./src/subtitle/json_subtitle/allResult`;
    const fileNameAll = "allResult.json";

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

    fs.appendFile(
      `${folderPathAll}/${fileNameAll}`,
      `${JSON.stringify(dividedFrequencies) + ","}`,
      (err) => {
        if (err) {
          reject(err);
        } else {
          console.log("The file has been saved!");
          resolve();
        }
      }
    );
  });
}
// countWord("3Ovayvsgb6g");
module.exports = countWord;
