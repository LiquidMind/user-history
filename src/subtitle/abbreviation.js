const natural = require("natural");
const fs = require("fs");

const abbreviationText = (arrHistory) => {
  return new Promise((resolve, reject) => {
    const arr = require(`./json_subtitle/${arrHistory}/${arrHistory}.json`);
    const resKey = arr.join(" ");

    const input = resKey;

    //Updated RegExp to match Ukrainian letters
    const regex = /[a-zA-Zа-яА-ЯїєіЇЄІ]+/g;

    const words = input
      .replace(
        /\b(?:webvtt|captions|start|kind|position|align|ru|en|ua|language|c|nbsp)\b/gi,
        ""
      )
      .match(regex);

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

    fs.writeFile(
      `./src/subtitle/json_subtitle/${arrHistory}/next_${arrHistory}.json`,
      JSON.stringify(stems),
      "utf8",
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
