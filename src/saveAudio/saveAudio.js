// const ytdl = require("ytdl-core");
// const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
// const ffmpeg = require("fluent-ffmpeg");
// const fs = require("fs");
// const path = require("path");
// const { db } = require("../model/dbConnection");

// ffmpeg.setFfmpegPath(ffmpegPath);

// const selectVideoIds = `
//   SELECT id
//   FROM videos_all
//   WHERE
//     saveAudio = 0 AND
//     (
//       (language IS NOT NULL AND original_language IS NOT NULL AND language != original_language)
//       OR (language IS NOT NULL AND default_language IS NOT NULL AND language != default_language)
//       OR (original_language IS NOT NULL AND default_language IS NOT NULL AND original_language != default_language)
//     );
// `;

// db.query(selectVideoIds, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
// });

// const updateSaveAudio = (id, status) => `
//   UPDATE videos_all
//   SET saveAudio = ${status}
//   WHERE id = ${id};
// `;

// (async () => {
//   try {
//     while (true) {
//       const { rows: videoIds } = await db.query(selectVideoIds);
//       console.log(videoIds);
//       if (videoIds.length === 0) {
//         console.log("Немає нових відео для обробки. Чекаємо...");
//         await new Promise((resolve) => setTimeout(resolve, 60 * 1000)); // очікуйте 1 хвилину
//         continue;
//       }

//       for (const video of videoIds) {
//         await (async () => {
//           const videoId = video.id;
//           const url = `https://www.youtube.com/watch?v=${videoId}`;

//           const info = await ytdl.getInfo(url);
//           const audioFormat = ytdl.chooseFormat(info.formats, {
//             quality: "highestaudio",
//           });

//           const dirPath = path.join(__dirname, videoId);
//           if (!fs.existsSync(dirPath)) {
//             fs.mkdirSync(dirPath);
//           }

//           const audioFileName = path.join(dirPath, `${videoId}.mp3`);

//           console.log("Завантаження аудіо...");

//           try {
//             await new Promise((resolve, reject) => {
//               ffmpeg(audioFormat.url)
//                 .outputOptions(
//                   "-vn",
//                   "-ar",
//                   "44100",
//                   "-ac",
//                   "2",
//                   "-b:a",
//                   "192K"
//                 )
//                 .output(audioFileName)
//                 .on("end", () => {
//                   console.log("Аудіофайл завантажено!");
//                   resolve();
//                 })
//                 .on("error", (error) => reject(error))
//                 .run();
//             });

//             await db.query(updateSaveAudio(videoId, 1));
//           } catch (error) {
//             console.error("Помилка під час конвертації в аудіо:", error);
//             await db.query(updateSaveAudio(videoId, null));
//           }
//         })();
//       }
//     }
//   } catch (error) {
//     console.error("Помилка:", error);
//   }
// })();

const ytdl = require("ytdl-core");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const { db } = require("../model/dbConnection");

ffmpeg.setFfmpegPath(ffmpegPath);

const selectVideoIds = `
  SELECT id
  FROM videos_all
  WHERE
    saveAudio = 0 AND
    (
      (language IS NOT NULL AND original_language IS NOT NULL AND language != original_language)
      OR (language IS NOT NULL AND default_language IS NOT NULL AND language != default_language)
      OR (original_language IS NOT NULL AND default_language IS NOT NULL AND original_language != default_language)
    );
`;

const updateSaveAudio = (id, status) => `
  UPDATE videos_all
  SET saveAudio = ${status}
  WHERE id = "${id}";
`;

const getVideoIds = (callback) => {
  db.query(selectVideoIds, (err, result) => {
    if (err) {
      console.log(err);
      callback([]);
    } else {
      callback(result);
    }
  });
};

async function processVideoIds(videoIds) {
  for (const video of videoIds) {
    const videoId = video.id;
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    const info = await ytdl.getInfo(url);
    const audioFormat = ytdl.chooseFormat(info.formats, {
      quality: "highestaudio",
    });

    const dirPath = path.join(
      "/Users/andrijkozevnikov/Documents/ProjectYoutube/Archive/audio",
      videoId
    );
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }

    const audioFileName = path.join(dirPath, `${videoId}.mp3`);

    console.log(`Завантаження аудіо...${videoId}`);

    try {
      await new Promise((resolve, reject) => {
        ffmpeg(audioFormat.url)
          .outputOptions("-vn", "-ar", "44100", "-ac", "2", "-b:a", "192K")
          .output(audioFileName)
          .on("end", () => {
            console.log("Аудіофайл завантажено!");
            resolve();
          })
          .on("error", (error) => reject(error))
          .run();
      });

      db.query(updateSaveAudio(videoId, 1), (err) => {
        if (err) {
          console.error("Помилка при оновленні поля saveAudio:", err);
        }
      });
    } catch (error) {
      console.error("Помилка під час конвертації в аудіо:", error);

      db.query(updateSaveAudio(videoId, null), (err) => {
        if (err) {
          console.error("Помилка при оновленні поля saveAudio:", err);
        }
      });
    }

    // Пауза на 1 хвилину перед обробкою наступного відео
    await new Promise((resolve) => setTimeout(resolve, 60 * 2000));
  }
}

function continueExecution() {
  (async () => {
    try {
      while (true) {
        getVideoIds((videoIds) => {
          if (videoIds.length === 0) {
            console.log("Немає нових відео для обробки. Чекаємо...");
            setTimeout(() => {
              continueExecution();
            }, 60 * 1000);
          } else {
            processVideoIds(videoIds);
          }
        });

        await new Promise((resolve) => setTimeout(resolve, 60000));
      }
    } catch (error) {
      console.error("Помилка:", error);
    }
  })();
}

continueExecution();
