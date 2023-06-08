// const fs = require("fs").promises;

// const addFolderWordsUser = async (statusSub, idUser) => {
//   const directory = `/Users/andrijkozevnikov/Documents/ProjectYoutube/Archive/users_wordFolder/user_${idUser}`;

//   try {
//     await fs.mkdir(directory, { recursive: true });
//     console.log(`Directory ${directory} created successfully`);

//     const objWord = require(`../json_subtitle/${statusSub}/countWholeWords_${statusSub}.json`);
//     const arrays = Object.entries(objWord);

//     async function createDir(path, numb) {
//       const parts = path.split("/");
//       const filename = parts.pop() + ".txt";

//       for (let i = 1; i <= parts.length; i++) {
//         const subPath = `${directory}/${parts.slice(0, i).join("/")}`;
//         console.log(subPath);
//         try {
//           await fs.access(subPath);
//         } catch {
//           await fs.mkdir(subPath);
//         }
//       }

//       const filePath = `${directory}/${parts.join("/")}/${filename}`;
//       const fileData = `${statusSub}:${numb},`;

//       try {
//         const existingData = await fs.readFile(filePath, "utf8");
//         if (!existingData.includes(fileData)) {
//           await fs.appendFile(filePath, fileData);
//         }
//       } catch {
//         await fs.writeFile(filePath, fileData);
//       }
//     }

//     for (let i = 0; i < arrays.length; i++) {
//       const [a, b] = arrays[i];
//       const letters = a.split("").join("/");
//       await createDir(letters, b);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// module.exports = addFolderWordsUser;

const fs = require("fs").promises;
const createReadStream = require("fs").createReadStream;
const csv = require("csv-parser");
const addFoldersWithJson = require("./addFoldersWithJson");

const addFolderWordsUser = async (statusSub, idUser) => {
  const directory = `/Users/andrijkozevnikov/Documents/ProjectYoutube/Archive/users_wordFolder/user_${idUser}`;

  try {
    await fs.mkdir(directory, { recursive: true });
    console.log(`Directory ${directory} created successfully`);

    const csvFilePath = `/Users/andrijkozevnikov/Documents/ProjectYoutube/videos_files_words/files/${statusSub}/words_frequencies_sorted.csv`;

    try {
      await fs.access(csvFilePath);
    } catch {
      throw new Error(`File not found: ${csvFilePath}`);
    }

    const results = [];

    await new Promise((resolve, reject) => {
      createReadStream(csvFilePath)
        .pipe(csv({ headers: ["key", "value"] }))
        .on("data", (data) => {
          const word = data.key.trim();
          const count = data.value.trim();
          if (word) {
            const pathParts = word.split("").join("/");
            results.push({ path: pathParts, count: count });
          }
        })
        .on("end", async () => {
          for (let i = 0; i < results.length; i++) {
            const { path, count } = results[i];
            await createDir(path, count);
          }
          resolve();
        })
        .on("error", (error) => {
          console.error("Error in reading CSV:", error);
          reject(error);
        });
    });
  } catch (error) {
    console.log(error);
    console.log("CETCh");
    await addFoldersWithJson(statusSub, idUser);
  }

  async function createDir(path, numb) {
    const parts = path.split("/");
    const filename = parts.pop() + ".txt";

    for (let i = 1; i <= parts.length; i++) {
      const subPath = `${directory}/${parts.slice(0, i).join("/")}`;
      console.log(subPath);
      try {
        await fs.access(subPath);
      } catch {
        await fs.mkdir(subPath);
      }
    }

    const filePath = `${directory}/${parts.join("/")}/${filename}`;
    const fileData = `${statusSub}:${numb},`;

    try {
      const existingData = await fs.readFile(filePath, "utf8");
      if (!existingData.includes(fileData)) {
        await fs.appendFile(filePath, fileData);
      }
    } catch {
      await fs.writeFile(filePath, fileData);
    }
  }
};

// const id = "_Ol89E8Iewo";
// const id2 = "lJEcoWwl6aU";

// addFolderWordsUser(id);

module.exports = addFolderWordsUser;
