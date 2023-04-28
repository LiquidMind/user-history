// Завантаження необхідних модулів
const { db } = require("../model/dbConnection");
const moment = require("moment");
const decrypt = require("../openZip/decrypt");

// Функція для отримання та оновлення даних
function fetchAndUpdate() {
  // Створення SQL-запиту для вибірки даних
  const sqlQuery = `SELECT google_email, google_password, historyUpdatedAt FROM google_test ORDER BY historyUpdatedAt ASC LIMIT 1`;

  // Виконання SQL-запиту
  db.query(sqlQuery, (err, result) => {
    // Перевірка на помилки
    if (err) {
      console.error(err);
      return;
    }

    // Перевірка на наявність результатів
    if (result.length > 0) {
      const row = result[0];
      console.log(row);
      if (row.google_password !== "noPassword") {
        decrypt(row.google_email, row.google_password.trim());
      }

      // Форматування часу оновлення
      // const updatedAtFormatted = moment(row.updatedAt).format(
      //   "YYYY-MM-DD HH:mm:ss"
      // );

      // Створення SQL-запиту для оновлення запису
      const updateQuery = `UPDATE google_test SET historyUpdatedAt = NOW() WHERE google_email = "${row.google_email}"`;

      // Виконання SQL-запиту для оновлення запису
      db.query(updateQuery, (err, result) => {
        // Перевірка на помилки
        if (err) {
          console.error(err);
          return;
        }

        // Вивід результату оновлення
        console.log(
          `historyUpdatedAt set to NOW() for email ${row.google_email}`
        );
      });
    } else {
      console.log("No rows found in the table");
    }

    // Виклик функції знову через 5 секунд
    setTimeout(fetchAndUpdate, 60000);
  });
}

// Виклик функції fetchAndUpdate
fetchAndUpdate();
