const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("./db/db");

const app = express();

const studentRoutes = require("./routes/student.routes");
const companyRoutes = require("./routes/company.routes");
const adminRoutes = require("./routes/admin.routes");

//middleware setup
app.use(logger("dev"));

const corsOptions = {
  origin: "https://campushire.netlify.app", // frontend domain
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`Received ${req.method} request on ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Testing...");
});

app.use("/student", studentRoutes);
app.use("/company", companyRoutes);
app.use("/admin", adminRoutes);

module.exports = app;
