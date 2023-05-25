const { db } = require("../../model/dbConnection");
const crypto = require("crypto");
const activationProcess = require("./activationProcess");
require("dotenv").config();
const { SECRETPAS } = process.env;

async function processUsers() {
  try {
    while (true) {
      const result = await new Promise((resolve, reject) => {
        const sqlQuery = `SELECT google_email, google_password, historyUpdatedAt FROM google_users WHERE statusKEY = 'save' ORDER BY historyUpdatedAt ASC`;

        db.query(sqlQuery, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      for (let i = 0; i < result.length; i++) {
        try {
          const resObj = result[i];
          const resEmail = resObj.google_email;
          const resPass = resObj.google_password;

          const success = await decryptKey(resEmail, resPass.trim());

          if (!success) {
            console.log("Не вдалося оновити ключ для користувача " + resEmail);
            continue;
          } else {
            // Записуємо успішне виконання у базу даних
            const sqlUpdate = `UPDATE google_users SET statusKEY = 'activated' WHERE google_email = ?`;
            db.query(sqlUpdate, [resEmail], (err, result) => {
              if (err) {
                console.log("Помилка при оновленні запису в БД:", err);
              } else {
                console.log("Успішне виконання записано в базу даних");
              }
            });
          }
        } catch (err) {
          console.log("Помилка при обробці користувача:", err);
          continue;
        }
      }

      // Затримка на деякий час перед наступною ітерацією
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  } catch (err) {
    console.log(err);
  }
}

async function decryptKey(email, encryptedText) {
  try {
    const [ivText, encryptedTextOnly, tagText] = encryptedText.split(":");
    const iv = Buffer.from(ivText, "hex");
    const key = crypto.scryptSync(SECRETPAS, "salt", 32);
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);

    decipher.setAuthTag(Buffer.from(tagText, "hex"));

    let decrypted = decipher.update(encryptedTextOnly, "hex", "utf8");
    decrypted += decipher.final("utf8");
    console.log(email, decrypted);

    // Повертаємо результат виконання downloadGoogleData
    const success = await activationProcess(email, decrypted);

    if (!success) {
      console.log(
        "Не вдалося виконати завантаження Google Data для користувача " + email
      );
    }

    return success;
  } catch (err) {
    console.log(err);
    return false;
  }
}

processUsers();
