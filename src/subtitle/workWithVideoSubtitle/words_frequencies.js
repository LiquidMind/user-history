const fs = require("fs").promises;
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

async function createSortedUniqueWordsFilesFromCSV(fileName) {
  try {
    const inputFilePath = `/Users/andrijkozevnikov/Documents/ProjectYoutube/videos_files_words/files/${fileName}/words.csv`;
    const outputFilePath = `/Users/andrijkozevnikov/Documents/ProjectYoutube/videos_files_words/files/${fileName}/words_frequencies_sorted.csv`;

    const wordCounts = {};

    const csvData = await fs.readFile(inputFilePath, "utf8");
    const words = csvData.split(/\s+/); // Розділяємо рядок на слова за пробілами

    for (const word of words) {
      if (word) {
        const trimmedWord = word.trim();
        wordCounts[trimmedWord] = (wordCounts[trimmedWord] || 0) + 1;
      }
    }

    const sortedWordCounts = Object.entries(wordCounts).sort(
      ([, a], [, b]) => b - a
    );

    const csvWriter = createCsvWriter({
      path: outputFilePath,
      header: [
        { id: "word", title: "Word" },
        { id: "frequency", title: "Frequency" },
      ],
    });

    const records = sortedWordCounts.map(([word, frequency]) => ({
      word,
      frequency,
    }));

    await csvWriter.writeRecords(records);

    // Видаляємо перший рядок з вихідного файлу
    const csvContent = await fs.readFile(outputFilePath, "utf8");
    const csvLines = csvContent.split("\n").slice(1).join("\n");
    await fs.writeFile(outputFilePath, csvLines);

    console.log(`Sorted CSV file has been created: ${outputFilePath}`);
  } catch (error) {
    console.error(`Error processing file: ${error}`);
  }
}

module.exports = createSortedUniqueWordsFilesFromCSV;
