const { db } = require("../model/dbConnection");

const sqlQuery = `UPDATE videos_updates SET curr_likes=?     WHERE iteration=1`;
db.query(sqlQuery, [1], (err, res) => {
  if (err) {
    console.log(err);
  }
});
