const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || "lens_db",
  waitForConnections: true,
  connectionLimit: 10,
});

global.db = pool.promise();

module.exports = pool;
