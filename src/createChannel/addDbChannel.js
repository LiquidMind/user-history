const { db } = require("../model/dbConnection");
const decryptChannel = require("./decryptChannel");

function processNewUsers() {
  const sqlQuery = `SELECT google_email, google_password, status_channel FROM google_users WHERE status_channel = 0`;

  // Виконуємо запит до бази даних
  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }

    // Перебираємо отримані результати
    result.forEach((resObj) => {
      const email = resObj.google_email;
      let password = resObj.google_password;
      const statusChannel = resObj.status_channel;

      // Перевіряємо, чи існує пароль
      if (password === "noPassword") {
        return;
      }

      setTimeout(() => {
        decryptChannel(email, password.trim());
      }, 5000);

      // Оновлюємо статус користувача в базі даних
      const sqlQuery2 = `UPDATE google_users SET status_channel = 1 WHERE google_email = '${email}'`;

      if (statusChannel === 0) {
        db.query(sqlQuery2, (err, result) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log(`User ${email} channel successfully added`);
        });
      }
    });
  });
}

// Викликаємо функцію спочатку один раз
processNewUsers();

// Викликаємо функцію кожні 10 секунд (можете змінити цей інтервал)
setInterval(processNewUsers, 10000);
