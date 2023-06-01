// "INSERT INTO videos_all (id, title, titleUrl, timeDate) VALUE (?,?,?,?)";

const { db } = require("../../model/dbConnection");
const fs = require("fs");

// Функція для запиту до бази даних і оновлення файлу JSON
function performQueryAndUpdateFile() {
  let nameDB = "videos_user_7";

  const sqlQuery = `SELECT id, channeTitle, channelId, dateRecorded FROM ${nameDB} WHERE addJSON=0`;
  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }

    const jsonArray = [];

    for (let i = 0; i < result.length; i++) {
      const resObj = result[i];
      const id = resObj.id;
      const channeTitle = resObj.channeTitle;
      const channelId = resObj.channelId;
      const dateRecorded = resObj.dateRecorded;

      const objectVideo = {
        id: `${id}`,
        title: `${id}`,
        titleUrl: `https://www.youtube.com/watch?v\u003d${id}`,
        timeDate: `${dateRecorded}`,
        channelId: `${channelId}`,
        channeTitle: `${channeTitle}`,
      };

      jsonArray.push(objectVideo);
      console.log(objectVideo);

      // Оновлення значення addJSON
      const updateQuery = `UPDATE videos_user_7 SET addJSON=1 WHERE id="${id}"`;
      db.query(updateQuery, (err) => {
        if (err) {
          console.log("Помилка при оновленні значення addJSON:", err);
        }
      });
    }

    // Читання вмісту файлу, якщо він існує
    let existingArray = [];
    if (
      fs.existsSync(
        `/Users/andrijkozevnikov/Documents/ProjectYoutube/VirtualUsers/${nameDB}.json`
      )
    ) {
      const existingContent = fs.readFileSync(
        `/Users/andrijkozevnikov/Documents/ProjectYoutube/VirtualUsers/${nameDB}.json`,
        "utf8"
      );
      existingArray = JSON.parse(existingContent);
    }

    // Додавання нових об'єктів до існуючого масиву
    const updatedArray = existingArray.concat(jsonArray);

    // Запис оновленого масиву до файлу
    const jsonContent = JSON.stringify(updatedArray);
    fs.writeFile(
      `/Users/andrijkozevnikov/Documents/ProjectYoutube/VirtualUsers/${nameDB}.json`,
      jsonContent,
      "utf8",
      (err) => {
        if (err) {
          console.log("Помилка при записі до файлу:", err);
        } else {
          console.log(
            "Об'єкти були успішно записані у файл cartoon_history.json. Очікуємо..."
          );
        }
      }
    );
  });
}
// 64drtk3v3lk
// Запуск функції кожні 5 секунд
setInterval(performQueryAndUpdateFile, 5000);
