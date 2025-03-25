const mysql = require("mysql2");

const host = process.env.MYSQL_HOST;
const user = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;
const database = process.env.MYSQL_DB;

const db = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
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

