const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
});

db.connect((err) => {
    if (err) {
        console.log("Connection to DB failed");
        console.error(err);
        process.exit(1);
    }
    console.log("Connected to database successfully");
});

module.exports = db;

