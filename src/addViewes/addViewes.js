const arrViewes = require("../array/arrViewes");
const { db } = require("../model/dbConnection");

function historyId(arrViewes) {
  for (let i = 0; i < arrViewes.length; i++) {
    const resInd = arrViewes[i];

    // videoId
    const titleUrl = resInd.titleUrl;
    const videoID = titleUrl?.slice(32, 47);

    // likeVideo
    function videoInfo(info) {
      const vieweVideo = info?.statistics.viewCount;
      const likeVideo = info?.statistics.likeCount;

      // add DB
      const sqlQuery =
        "UPDATE user_history_youtube SET   viewes=?, oklike=?  WHERE  user_history_youtube_id=?";
      db.query(
        sqlQuery,
        [vieweVideo || "0", likeVideo || "0", videoID],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
          }
        }
      );
    }

    fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoID}&key=AIzaSyBkUQj9uoanlVgZWB8_LPgsxrBUIoSgV-Y`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const a = videoInfo(...data.items);
        console.log(a);
      });
  }
}
// historyId("b4mBF78oOoY"); // test Function

historyId(arrViewes);
