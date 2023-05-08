const crypto = require("crypto");
require("dotenv").config();
const { db } = require("../model/dbConnection");

const { SECRETPAS } = process.env;
const { email, password } = require("./dataUser");
console.log(email);

// const emailNickName = email.replace(/[@.]/g, "");
// const fileZipName = emailNickName;
// console.log(fileZipName);

if (email.length && password.length) {
  function encrypt(text, masterPassword) {
    const iv = crypto.randomBytes(16); // генерація випадкового вектора ініціалізації
    const key = crypto.scryptSync(masterPassword, "salt", 32); // генерація ключа шифрування з паролем майстра
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv); // створення об'єкту шифрування

    let encrypted = cipher.update(text, "utf8", "hex"); // шифрування вхідного тексту
    encrypted += cipher.final("hex"); // додавання шифротексту до результату
    const tag = cipher.getAuthTag().toString("hex"); // отримання тега автентифікації

    // Повертаємо рядок, що складається з iv, encrypted та tag, розділених двокрапкою
    return ` ${iv.toString("hex")}:${encrypted}:${tag}`;
  }
}
// Приклад використання функції encrypt
const encryptedText = encrypt(password, SECRETPAS);
console.log(encryptedText); // Виведе рядок, що складається з iv, encrypted та tag, розділених двокрапкою

// const sqlQuery = `INSERT INTO google_test (google_email, google_password) VALUE (?,?)`;
// db.query(sqlQuery, [email, encryptedText], (err, result) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(result);
//   }
//   db.end();
// });

const sqlQuery2 = `UPDATE google_users SET google_password = '${encryptedText}' WHERE google_email = '${email}'`;
db.query(sqlQuery2, (err, result) => {
  if (err) {
    console.log(err);
  }
  console.log(`login user ${email} update`);
});
