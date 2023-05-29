const { db } = require("../../model/dbConnection");
const fs = require("fs");
const moment = require("moment");

const addHistoryAllDb = async (nameChannel) => {
  let str = `${nameChannel}`;
  let match = str.match(/^([^@]*)/);
  const category = match[0];

  try {
    const data = fs.readFileSync(
      `/Users/andrijkozevnikov/Documents/ProjectYoutube/VirtualUsers/${category}.json`,
      "utf-8"
    );
    const jsonArray = JSON.parse(data);

    console.log(jsonArray);

    for (let item of jsonArray) {
      const timeDate = moment(item.timeDate).format("YYYY-MM-DD HH:mm:ss");
      const params = [item.id, item.title, item.titleUrl, timeDate, category];
      const sql =
        "INSERT INTO videos_all (id, title, titleUrl, timeDate, category) VALUES (?,?,?,?,?)";

      db.query(sql, params, (err) => {
        if (err) {
        }
        console.log(err);
      });
    }

    console.log("All data have been successfully added to the database");
  } catch (err) {
    console.error(err);
  }
};

module.exports = addHistoryAllDb;
