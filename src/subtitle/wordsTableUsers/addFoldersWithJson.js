const fs = require("fs").promises;

const addFoldersWithJson = async (statusSub, idUser) => {
  const directory = `/Users/andrijkozevnikov/Documents/ProjectYoutube/Archive/users_wordFolder/user_${idUser}`;
  // const directory = `/Users/andrijkozevnikov/Documents/test_arch`;

  try {
    await fs.mkdir(directory, { recursive: true });
    console.log(`Directory ${directory} created successfully`);

    const objWord = require(`../json_subtitle/${statusSub}/countWholeWords_${statusSub}.json`);
    const arrays = Object.entries(objWord);

    async function createDir(path, numb) {
      const parts = path.split("/");
      const filename = parts.pop() + ".txt";

      for (let i = 1; i <= parts.length; i++) {
        const subPath = `${directory}/${parts.slice(0, i).join("/")}`;
        console.log(subPath);
        try {
          await fs.access(subPath);
        } catch {
          try {
            await fs.mkdir(subPath);
          } catch (error) {
            console.error("Error creating directory:", error);
          }
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
        try {
          await fs.writeFile(filePath, fileData);
        } catch (error) {
          console.error("Error writing file:", error);
        }
      }
    }

    for (let i = 0; i < arrays.length; i++) {
      const [a, b] = arrays[i];
      const letters = a.split("").join("/");
      await createDir(letters, b);
    }
  } catch (error) {
    console.error("Error in addFoldersWithJson:", error);
  }
};

module.exports = addFoldersWithJson;
