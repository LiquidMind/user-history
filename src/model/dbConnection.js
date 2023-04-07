const mysql = require("mysql");
require("dotenv").config();

const { HOST, USER, DATABASE, PASSWORD } = process.env;

const db = mysql.createPool({
  host: HOST,
  user: "root",
  database: DATABASE,
  password: PASSWORD,
});

exports.db = db;
