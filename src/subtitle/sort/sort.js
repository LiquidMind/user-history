// const fs = require("fs");

// function sortWord(myObj) {
//   console.log(myObj);
//   const wordObj = require(`../json_subtitle/${myObj}/count_${myObj}.json`);
//   const sortedObject = Object.fromEntries(
//     Object.entries(wordObj).sort(([, a], [, b]) => b - a)
//   );

//   const sortedArray = [sortedObject];
//   console.log(sortedArray);

//   return new Promise((resolve, reject) => {
//     fs.writeFile(
//       `./src/subtitle/json_subtitle/${myObj}/sort_${myObj}.json`,
//       JSON.stringify(sortedArray),
//       (err) => {
//         if (err) {
//           reject(err);
//         } else {
//           console.log("The file has been saved!");
//           resolve();
//         }
//       }
//     );
//   });
// }

// sortWord("_4zK7pbVfho");

// module.exports = sortWord;
