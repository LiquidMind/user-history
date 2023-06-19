const { db } = require("../model/dbConnection");

const addVideosInTableUpdates = () => {
  const sqlQuery = `SELECT id,timeDate,viewes, okLike FROM videos_all WHERE addUpdates = 0 AND (viewes != 0 OR okLike != 0)`;

  db.query(sqlQuery, (err, results) => {
    if (err) {
      console.log(err);
    }

    for (const resObj of results) {
      const id = resObj.id;
      const viewes = resObj.viewes;
      const okLike = resObj.okLike;
      const timeDate = resObj.timeDate;

      const sqlQuery = `INSERT INTO videos_updates (video_id, prev_datetime, prev_views, prev_likes, curr_datetime,curr_views,curr_likes,updates) VALUES (?,?,?,?,?,?,?,?)`;

      db.query(
        sqlQuery,
        [id, null, null, null, timeDate, viewes, okLike, 0], // Змінили значення на null для prev_datetime, prev_views, prev_likes
        (err) => {
          if (err) {
            console.log(err);
          }
          console.log(`дані записані в таблицю videos_updates`);
          const sqlQuery = `UPDATE videos_all SET addUpdates=1 WHERE id = ?`;
          db.query(sqlQuery, [id], (err) => {
            if (err) {
              console.log(err);
            }
            console.log(`addUpdates оновлене в ${id}`);
          });
        }
      );
    }
  });
};

// Запускаємо функцію кожні 5 секунди
setInterval(addVideosInTableUpdates, 5000);
