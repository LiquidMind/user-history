const youtubedl = require("youtube-dl-exec");
const path = require("path");

const addSubtitle = (videoId, language) => {
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  const options = {
    writeSub: true,
    writeAutoSub: true,
    subLang: language,
    skipDownload: true,
    output: path.join(".", `${videoId}.vtt`),
  };

  youtubedl(videoUrl, options)
    .then((output) => {
      console.log("Subtitles downloaded:", output);
    })
    .catch((err) => {
      console.error("Error:", err);
    });
};

// Example usage
addSubtitle("IkS-HVpi_8E", "ru");
