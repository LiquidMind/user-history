const natural = require("natural");

const fs = require("fs");
// const arrHistory = require("./arrHistory/arrTest");

const abbreviationText = (arrHistory) => {
  return new Promise((resolve, reject) => {
    const arr = require(`./json_subtitle/${arrHistory}/${arrHistory}.json`);
    const resKey = arr.join(" ");

    const input = resKey;

    // const regex = /[а-яА-Я]+/g; //Cyrillic

    const regex = /[a-zA-Zа-яА-Я]+/g; //Cyrillic and Latin
    const words = input
      .replace(
        /\b(?:webvtt|captions|start|kind|position|align|ru|en|ua|language|c)\b/gi,
        ""
      )
      .match(regex);

    // console.log(filteredText);

    // const words = input.match(regex);

    fs.writeFile(
      `./src/subtitle/json_subtitle/${arrHistory}/wholeWords_${arrHistory}.json`,
      JSON.stringify(words),
      (err) => {
        if (err) {
          console.error("Error:", err);
          reject(err);
        } else {
          console.log("The file has been saved!");
          resolve();
        }
      }
    );

    const stemmer = natural.PorterStemmerRu;

    const stems = words.map((word) => stemmer.stem(word));
    // console.log(stems); // Output: ['AeBo4K', ' ABO4K', 'ABO4K', AeBO4K

    fs.writeFile(
      `./src/subtitle/json_subtitle/${arrHistory}/next_${arrHistory}.json`,
      JSON.stringify(stems),
      (err) => {
        if (err) {
          console.error("Error:", err);
          reject(err);
        } else {
          console.log("The file has been saved!");
          resolve();
        }
      }
    );
  });
};

// abbreviationText("OJfzVAFW9eo");

module.exports = abbreviationText;
