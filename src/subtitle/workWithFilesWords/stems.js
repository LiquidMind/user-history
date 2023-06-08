const fs = require("fs").promises;
const natural = require("natural");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

async function createStemmedWordsFileFromCSV(fileName) {
  try {
    const inputFilePath = `/Users/andrijkozevnikov/Documents/ProjectYoutube/videos_files_words/files/${fileName}/words.csv`;

    // Читаємо дані з CSV файлу
    const csvData = await fs.readFile(inputFilePath, "utf8");
    const words = csvData.split(/\s+/); // Розділяємо рядок на слова за пробілами

    // Створюємо масив зі стемами слів
    const stemmedWords = words.map((word) =>
      natural.PorterStemmerRu.stem(word)
    );

    // Записуємо дані в CSV формат
    const outputFilePath = `/Users/andrijkozevnikov/Documents/ProjectYoutube/videos_files_words/files/${fileName}/stems.csv`;

    const csvWriter = createCsvWriter({
      path: outputFilePath,
      header: [{ id: "stem", title: "Stem" }],
    });

    const records = stemmedWords.map((stem) => ({ stem }));

    await csvWriter.writeRecords(records);

    // Видаляємо перший рядок з вихідного файлу
    const csvContent = await fs.readFile(outputFilePath, "utf8");
    const csvLines = csvContent.split("\n").slice(1).join("\n");
    await fs.writeFile(outputFilePath, csvLines);

    console.log(
      `Stemmed words CSV file has been created: /Users/andrijkozevnikov/Documents/ProjectYoutube/videos_files_words/files/${fileName}/stems.csv`
    );
  } catch (error) {
    console.error(`Error processing file: ${error}`);
  }
}

module.exports = createStemmedWordsFileFromCSV;
