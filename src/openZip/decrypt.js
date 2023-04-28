const crypto = require("crypto");
const { db } = require("../model/dbConnection");
require("dotenv").config();
const { SECRETPAS } = process.env;
const downloadGoogleData = require("./saveUserZip");
const createZipFile = require("./renameZip");

console.log(SECRETPAS);

// Функція для розшифрування зашифрованого тексту з використанням пароля майстра
function decrypt(email, encryptedText) {
  const [ivText, encryptedTextOnly, tagText] = encryptedText.split(":"); // розділення рядка на iv, encryptedTextOnly та tagText
  const iv = Buffer.from(ivText, "hex"); // перетворення iv з шестнадцяткового формату в буфер
  const key = crypto.scryptSync(SECRETPAS, "salt", 32); // генерація ключа шифрування з паролем майстра
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv); // створення об'єкту розшифрування

  decipher.setAuthTag(Buffer.from(tagText, "hex")); // встановлення тега автентифікації

  let decrypted = decipher.update(encryptedTextOnly, "hex", "utf8"); // розшифрування шифротексту
  decrypted += decipher.final("utf8"); // додавання розшифрованого тексту до результату
  // createZipFile(email);
  return downloadGoogleData(email, decrypted); // Повертаємо розшифрований текст
}

// const decryptedText = decrypt(email, SECRETPAS);
// console.log(decryptedText); // Виведе "Hello, world!"

module.exports = decrypt;
