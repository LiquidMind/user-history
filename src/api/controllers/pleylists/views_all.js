const views_all = async (req, res) => {
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
};

module.exports = views_all;
