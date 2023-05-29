const fs = require("fs");

const addWordFoundUser = async (resID, idUser) => {
  return new Promise(async (resolve, reject) => {
    const directory = `/Users/andrijkozevnikov/Documents/ProjectYoutube/Archive/users_wordFolder/user_${idUser}`;

    fs.mkdir(directory, { recursive: true }, (err) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(`Directory ${directory} created successfully`);
      }
    });
    try {
      const objWord = require(`../json_subtitle/${resID}/countWholeWords_${resID}.json`);

      // // Convert the object to an array of key-value pairs
      const arrays = Object.entries(objWord);

      function createDir(path, numb) {
        // Split the path into individual directories using slashes
        const parts = path.split("/");
        // Add the ".txt" extension to the last directory name to create the filename
        const filename = parts.pop() + ".txt";

        // Loop through the directories array and create each directory if it does not already exist
        for (let i = 1; i <= parts.length; i++) {
          const subPath =
            `/Users/andrijkozevnikov/Documents/ProjectYoutube/Archive/users_wordFolder/user_${idUser}` +
            "/" + // Add a path separator
            parts.slice(0, i).join("/");
          console.log(subPath);
          if (!fs.existsSync(subPath)) {
            fs.mkdirSync(subPath);
          }
        }

        // Create the full path to the file by combining the directories array and the filename
        const filePath =
          `/Users/andrijkozevnikov/Documents/ProjectYoutube/Archive/users_wordFolder/user_${idUser}` +
          "/" + // Add a path separator
          parts.join("/") +
          "/" +
          filename;

        // Check if the file exists and write the key-value pair to it
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, `${resID}:${numb},`);
        } else {
          fs.appendFileSync(filePath, `${resID}:${numb},`);
        }
      }

      // Loop through the key-value pairs array and call the createDir function for each of them
      for (let i = 0; i < arrays.length; i++) {
        const [a, b] = arrays[i];

        // Split the key into individual letters to create the directory structure
        const letters = a.split("").join("/");

        // Call the createDir function with the directory path and the value as arguments

        createDir(letters, b);
      }
      resolve(); // resolve the promise when the query is successful
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = addWordFoundUser;
