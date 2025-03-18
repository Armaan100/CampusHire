const dotenv = require("dotenv");
dotenv.config();

const express = require("express"); 
const logger = require("morgan");  
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/db");

const app = express();
connectDB();

const studentRoutes = require("./routes/student.routes");
const companyRoutes = require("./routes/company.routes");
const adminRoutes = require("./routes/admin.routes");

//middleware setup
app.use(logger("dev"));
app.use(cors({
    origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use("/student", studentRoutes);
app.use("/company", companyRoutes);
app.use("/admin", adminRoutes);
