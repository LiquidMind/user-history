const mysql = require("mysql");
require("dotenv").config();

const { HOST, USER, DATABASE, PASSWORD } = process.env;

const db = mysql.createPool({
  host: HOST,
  user: "root",
  database: DATABASE,
  password: PASSWORD,
  charset: "utf8mb4",
});

exports.db = db;
