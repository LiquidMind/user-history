const { db } = require("../../model/dbConnection");
const fs = require("fs");

//  СТВОРИ ФАЙЛ JSON З ПУСТИМ МАСИВОМ
let email = "cartoons@youtube.com";
const password = "virtual";
let match = email.match(/^([^@]*)/);
const nameFile = match[0];
console.log(nameFile);

const sqlQuery = `INSERT INTO google_test (google_email, google_password, status_channel,saveToken,statusKEY) VALUE (?,?,?,?,?)`;
db.query(sqlQuery, [email, password, 1, "save", "activated"], (err, result) => {
  if (err) {
    console.log(err);
  } else {
    // Записуємо пустий масив у json файл
    fs.writeFile(
      `/Users/andrijkozevnikov/Documents/ProjectYoutube/VirtualUsers/${nameFile}.json`,
      JSON.stringify([]), // Перетворюємо пустий масив в JSON формат
      "utf8",
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Файл успішно створено");
        }
      }
    );
  }
  db.end();
});
