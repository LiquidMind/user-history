const crypto = require("crypto");
require("dotenv").config();
const { SECRETPAS } = process.env;
const { createChannel } = require("./createChannel");
const { db } = require("../model/dbConnection");

// Функція для розшифрування зашифрованого тексту з використанням пароля майстра
function decryptChannel(email, encryptedText) {
  const [ivText, encryptedTextOnly, tagText] = encryptedText.split(":"); // розділення рядка на iv, encryptedTextOnly та tagText
  const iv = Buffer.from(ivText, "hex"); // перетворення iv з шестнадцяткового формату в буфер
  const key = crypto.scryptSync(SECRETPAS, "salt", 32); // генерація ключа шифрування з паролем майстра
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv); // створення об'єкту розшифрування

  decipher.setAuthTag(Buffer.from(tagText, "hex")); // встановлення тега автентифікації

  let decrypted = decipher.update(encryptedTextOnly, "hex", "utf8"); // розшифрування шифротексту
  decrypted += decipher.final("utf8"); // додавання розшифрованого тексту до результату
  console.log(email, decrypted);

  console.log(encryptedText);

  createChannel(email, decrypted);
}

// const decryptedText = decrypt(email, SECRETPAS);
// console.log(decryptedText); // Виведе "Hello, world!"
module.exports = decryptChannel;
