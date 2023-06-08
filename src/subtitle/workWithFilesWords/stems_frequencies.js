const fs = require("fs").promises;
const natural = require("natural");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

async function createSortedUniqueStemsFileFromCSV(fileName) {
  try {
    const inputFilePath = `/Users/andrijkozevnikov/Documents/ProjectYoutube/videos_files_words/files/${fileName}/stems.csv`;
    const outputFilePath = `/Users/andrijkozevnikov/Documents/ProjectYoutube/videos_files_words/files/${fileName}/stems_frequencies_sorted.csv`;

    const stemCounts = {};

    const csvData = await fs.readFile(inputFilePath, "utf8");
    const stems = csvData.split(/\s+/); // Розділяємо рядок на стеми за пробілами

    for (const stem of stems) {
      if (stem) {
        const trimmedStem = stem.trim();
        stemCounts[trimmedStem] = (stemCounts[trimmedStem] || 0) + 1;
      }
    }

    const sortedStemCounts = Object.entries(stemCounts).sort(
      ([, a], [, b]) => b - a
    );

    const csvWriter = createCsvWriter({
      path: outputFilePath,
      header: [
        { id: "stem", title: "Stem" },
        { id: "frequency", title: "Frequency" },
      ],
    });

    const records = sortedStemCounts.map(([stem, frequency]) => ({
      stem,
      frequency,
    }));

    await csvWriter.writeRecords(records);

    // Видаляємо перший рядок з вихідного файлу
    const csvContent = await fs.readFile(outputFilePath, "utf8");
    const csvLines = csvContent.split("\n").slice(1).join("\n");
    await fs.writeFile(outputFilePath, csvLines);

    console.log(`Sorted stems CSV file has been created: ${outputFilePath}`);
  } catch (error) {
    console.error(`Error processing file: ${error}`);
    return false;
  }
}

module.exports = createSortedUniqueStemsFileFromCSV;
