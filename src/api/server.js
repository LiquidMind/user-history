const express = require("express");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const axios = require("axios");

const app = express();
const cors = require("cors");
const { db } = require("../model/dbConnection");
const PORT = 3000;

app.use(cors());
app.use(express.json());

//всі відео по рейтингу views_per_second

app.get("/api/views_per_second", (req, res) => {
  const page = req.query.page || 1; // За замовчуванням використовується сторінка 1
  const pageSize = 10; // Кількість відео на сторінку
  const offset = (page - 1) * pageSize;

  const sqlQuery = `SELECT * FROM videos_all ORDER BY views_per_second DESC LIMIT ${offset}, ${pageSize}`;
  db.query(sqlQuery, (err, result) => {
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

// всі відео дял дітей та по рейтингу популярності за перідо

app.get("/api/made_for_kids", (req, res) => {
  const page = req.query.page || 1; // За замовчуванням використовується сторінка 1
  const pageSize = 10; // Кількість відео на сторінку
  const offset = (page - 1) * pageSize;

  const sqlQuery = `SELECT * FROM videos_all WHERE made_for_kids=1 ORDER BY views_per_second DESC LIMIT ${offset}, ${pageSize}`;
  db.query(sqlQuery, (err, result) => {
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

// Всі відео по  рейтингу  для дітей

app.get("/api/all/ageRating", (req, res) => {
  const page = req.query.page || 1; // За замовчуванням використовується сторінка 1
  const pageSize = 10; // Кількість відео на сторінку
  const offset = (page - 1) * pageSize;

  const sqlQuery = `SELECT * FROM videos_all WHERE made_for_kids = 1 ORDER BY views_per_second DESC LIMIT ${offset}, ${pageSize}`;
  db.query(sqlQuery, (err, result) => {
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

// Всі відео по  переглядах

app.get("/api/viewes", (req, res) => {
  const page = req.query.page || 1; // За замовчуванням використовується сторінка 1
  const pageSize = 10; // Кількість відео на сторінку
  const offset = (page - 1) * pageSize;

  const sqlQuery = `SELECT * FROM videos_all ORDER BY viewes DESC LIMIT ${offset}, ${pageSize}`;
  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);

      res.status(200).json({
        status: "success",
        code: 200,
        result: result,
      });
    }
  });
});

// ================================== PLEYLISTS API =======================================

app.get("/api/playlist_content", (req, res) => {
  const title = req.query.title; // Назва плейлиста вводиться користувачем
  console.log(title);

  if (!title) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Title parameter is required",
    });
  }

  const sqlQuery = `SELECT 
  playlists.playlist_id, 
  playlists_content.video_id, 
  videos_all.* 
FROM 
  playlists 
INNER JOIN 
  playlists_content ON playlists.playlist_id = playlists_content.playlist_id 
INNER JOIN 
  videos_all ON playlists_content.video_id = videos_all.id 
WHERE 
  playlists.title = 'Top 3 Most Viewed Daily Videos';
`;

  db.query(sqlQuery, [title], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        status: "error",
        code: 500,
        message: "Internal server error",
      });
    } else {
      console.log(result);
      res.status(200).json({
        status: "success",
        code: 200,
        result: result,
      });
    }
  });
});

// Блоки для порівняння
app.get("/api/all/choice", (req, res) => {
  const sqlQuery = `SELECT * FROM videos_all ORDER BY RAND() LIMIT 2`;
  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        status: "error",
        code: 500,
        message: "Failed to get video IDs",
      });
    } else {
      res.status(200).json({
        status: "success",
        code: 200,
        result,
      });
    }
  });
});

app.get("/api/video/:videoId", async (req, res) => {
  const videoId = req.params.videoId;

  try {
    const response = await axios.get(
      `https://www.youtube.com/watch?v=${videoId}`
    );
    const pageHtml = response.data;
    res.send(pageHtml);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving video page");
  }
});

// СОРТ ПО ДЛЯ ДОРОСЛІШИХ ДІТЕЙ АБО ДОРОСЛИХ
// app.post("/api/sorting", (req, res) => {
//   const { videoId1, videoId2 } = req.body;
//   const comparison = ">"; // Значення за замовчуванням або значення залежно від логіки

//   const sqlQuery = `INSERT INTO sorting (sorting_type, user_id, video_id_1, video_id_2, comparison) VALUES ('age', 1, ?, ?, ?)`;
//   db.query(sqlQuery, [videoId1, videoId2, comparison], (err, result) => {
//     if (err) {
//       console.log(err);
//       res.status(500).json({
//         status: "error",
//         code: 500,
//         message: "Failed to save video IDs",
//       });
//     } else {
//       res.status(200).json({
//         status: "success",
//         code: 200,
//         message: "Video IDs saved successfully",
//       });
//     }
//   });
// });

app.post("/api/sorting", (req, res) => {
  const { videoId1, videoId2, sortingType } = req.body; // Get the sorting type from the request
  const comparison = ">";

  const sqlQuery = `INSERT INTO sorting (sorting_type, user_id, video_id_1, video_id_2, comparison) VALUES (?, 1, ?, ?, ?)`;
  db.query(
    sqlQuery,
    [sortingType, videoId1, videoId2, comparison],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          status: "error",
          code: 500,
          message: "Failed to save video IDs",
        });
      } else {
        res.status(200).json({
          status: "success",
          code: 200,
          message: "Video IDs saved successfully",
        });
      }
    }
  );
});

app.patch("/api/sorting/:videoId1/:videoId2", (req, res) => {
  const { videoId1, videoId2 } = req.params;
  const { comparison } = req.body;

  const sqlQuery = `UPDATE sorting SET comparison = ? WHERE user_id = 1 AND video_id_1 = ? AND video_id_2 = ?`;
  db.query(sqlQuery, [comparison, videoId1, videoId2], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        status: "error",
        code: 500,
        message: "Failed to update comparison",
      });
    } else {
      res.status(200).json({
        status: "success",
        code: 200,
        message: "Comparison updated successfully",
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Conecting port: ${PORT}`);
});
