const { db } = require("../model/dbConnection");

const sqlQuery = `SELECT video_id FROM tag_multiki WHERE addJson = 0`;
db.query(sqlQuery, (err, res) => {
  if (err) {
    console.log(err);
  }

  for (const resObj of res) {
    const id = resObj.video_id;
    console.log(id);

    const sqlQuery = `UPDATE tag_multiki SET addJson = 1 WHERE video_id = ?`;
  }
});
