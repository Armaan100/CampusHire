const mysql = require("mysql");

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_DATABASE;

const db = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
});

db.connect((err) => {
    if (err) {
        console.log("Connection to DB failed");
        console.log(err);
        return;
    }
    console.log("Connected to database successfully");
});

module.exports = db;

