const { db } = require("../../model/dbConnection");
const fs = require("fs");

async function createUser(latinHashtag) {
  let email = `tag_${latinHashtag}@youtube.com`;
  const password = "virtual";
  let match = email.match(/^([^@]*)/);
  const nameFile = match[0];
  console.log(nameFile);

  const sqlQuery = `INSERT INTO google_users (google_email, google_password, status_channel,saveToken,statusKEY) VALUE (?,?,?,?,?)`;
  db.query(
    sqlQuery,
    [email, password, 1, "save", "activated"],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          console.log("Користувач з такою електронною адресою вже існує");
        } else {
          console.log(err);
        }
        // } else {
        // Записуємо пустий масив у json файл
        // fs.writeFile(
        //   `/Users/andrijkozevnikov/Documents/ProjectYoutube/VirtualUsers/${nameFile}.json`,
        //   JSON.stringify([]), // Перетворюємо пустий масив в JSON формат
        //   "utf8",
        //   (err) => {
        //     if (err) {
        // console.log(err);
        // } else {
        console.log("Користувача успішно створено");
        // }
        // }
        // );
      }
    }
  );
}

module.exports = createUser;
