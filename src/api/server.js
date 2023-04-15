const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ytdl = require("ytdl-core");

const app = express();
const cors = require("cors");
const { db } = require("../model/dbConnection");
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/api/all", (req, res) => {
  const sqlQuery = "SELECT * FROM max190716";
  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({
        status: "succes",
        code: 200,
        result: result,
      });
    }
  });
});

app.get("/api/allInfoUser", (req, res) => {
  const name = decodeURIComponent(req.query.name);
  console.log(name);
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const sqlQuery = `SELECT uh.user_history_youtube_id, uh.statusSub, uh.statusWord, uh.language, uh.title, uh.titleUrl, uh.viewes, uh.lengthVideo, uh.okLike FROM ${name} AS ${name} JOIN user_history_youtube AS uh ON ${name}.user_history_youtube_id = uh.user_history_youtube_id LIMIT ? OFFSET ?;`;

  db.query(sqlQuery, [limit, offset], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({
        status: "success",
        code: 200,
        result: result,
      });
    }
  });
});

app.post("/register", async (req, res) => {
  const nick_name = req.body.nick_name;
  const email = req.body.email;
  const password = req.body.password;

  const hashedPassword = await bcrypt.hash(password, 10); // хешуємо пароль з сіллю (10 разів)

  const sqlQuery =
    "INSERT INTO users (nick_name, email, password) VALUES (?, ?, ?)";
  db.query(sqlQuery, [nick_name, email, hashedPassword], (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .send("Сталася помилка при реєстрації користувача!");
    }
    res.status(200).send("Користувач успішно зареєстрований!");
  });
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  console.log(email, password);

  const sqlQuery = "SELECT * FROM users WHERE email = ? ";
  db.query(sqlQuery, [email], async (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Сталася помилка при вході користувача!");
    }

    if (result.length === 0) {
      return res
        .status(404)
        .send("Користувача з такою електронною адресою не знайдено!");
    }

    const user = result[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).send("Неправильний пароль!");
    }
    console.log(result);
    res.status(200).send("Вхід успішний!");
  });
});
app.get("/download", async (req, res, next) => {
  try {
    const url = req.query.url;

    console.log(url);
    if (!url || !ytdl.validateURL(url)) {
      return res.status(400).send("Invalid YouTube URL");
    }

    const info = await ytdl.getInfo(url);
    console.log(JSON.stringify(info, null, 2));
    const formats = info.formats;
    const highestQualityFormat = ytdl.chooseFormat(formats, {
      quality: "highest",
    });
    const videoReadableStream = ytdl(url, {
      format: highestQualityFormat,
    });
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${info.title}.mp4"`
    );
    videoReadableStream.pipe(res);
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send("Internal server error");
});

app.get("/api/:user_history_youtube_id", (req, res) => {
  const videoLink = req.params.user_history_youtube_id;
  console.log(videoLink);

  const sql = `SELECT  viewes, lengthVideo, okLike
FROM max190716
JOIN user_history_youtube
ON max190716.user_history_youtube_id = user_history_youtube.user_history_youtube_id
WHERE user_history_youtube.user_history_youtube_id =  '${videoLink}';`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing SQL query: " + err.stack);
      res.status(500).send("Error executing SQL query");
    }

    res.json(result);
  });
});

app.listen(PORT, () => {
  console.log(`Conecting port: ${PORT}`);
});
