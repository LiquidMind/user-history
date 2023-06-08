const fs = require("fs").promises;
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

async function createArrayFromTxtFile(fileName) {
  try {
    const filePath = `/Users/andrijkozevnikov/Documents/ProjectYoutube/videos_files_words/files/${fileName}/${fileName}.txt`;

    const data = await fs.readFile(filePath, "utf8");

    // Розділяємо текст на слова за допомогою пробілів
    const words = data.split(" ");

    // Записуємо дані в CSV формат
    const csvWriter = createCsvWriter({
      path: `/Users/andrijkozevnikov/Documents/ProjectYoutube/videos_files_words/files/${fileName}/words.csv`,
      header: ["word"],
    });

    const records = words.map((word) => ({ word }));

    await csvWriter.writeRecords(records);
    console.log(
      `CSV file has been created: /Users/andrijkozevnikov/Documents/ProjectYoutube/videos_files_words/files/${fileName}/words.csv`
    );
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    throw error;
  }
}

module.exports = createArrayFromTxtFile;
