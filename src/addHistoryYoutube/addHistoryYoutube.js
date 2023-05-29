const mysql2 = require("mysql2");
require("dotenv").config();

const { HOST, USER, DATABASE, PASSWORD } = process.env;

const connection = mysql2.createConnection({
  host: "localhost",
  user: "root",
  database: DATABASE,
  password: PASSWORD,
});

async function addHistoryYoutube(history, emailUser) {
  console.log(history);

  const [result] = await connection
    .promise()
    .execute(
      `SELECT id FROM google_users WHERE google_email = "${emailUser}" `
    );

  const userId = Object.values(result[0])[0];
  console.log(userId);

  await connection.promise().query(`
    CREATE TABLE IF NOT EXISTS videos_user_${userId} ( 
      id VARCHAR(20) PRIMARY KEY,
      title VARCHAR(1000) NOT NULL,
      titleUrl VARCHAR(255) NOT NULL,
      timeDate DATETIME NOT NULL,
      status ENUM('noSubtitles', 'saveWords', 'noWords', 'proces') NOT NULL DEFAULT 'proces'
    )
  `);

  for (const { titleUrl, time, title } of history) {
    if (!titleUrl) {
      continue;
    }

    const id = titleUrl.slice(32, 47);
    const dateWathVideo = time.slice(0, 18);
    const titleVideo = title.slice(18);
    const params = [id, titleVideo, titleUrl, dateWathVideo];

    const sql = `INSERT INTO videos_user_${userId} (id, title, titleUrl, timeDate) VALUE (?,?,?,?)`;

    try {
      await connection.promise().execute(sql, params);
      console.log("VIDEO USER ADD");

      const sql2 =
        "INSERT INTO videos_all (id, title, titleUrl, timeDate) VALUE (?,?,?,?)";
      await connection.promise().execute(sql2, params);

      console.log("VIDEO USER ADD");
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        console.log(`Duplicate entry error: ${err.message}`);
      } else {
        throw err;
      }
    }
  }
}

module.exports = addHistoryYoutube;
