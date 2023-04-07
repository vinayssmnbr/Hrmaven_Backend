require("dotenv").config();
var express = require("express");
var app = express();
var router = express.Router();
const mongoose = require("mongoose");
const cors = require("cors");
const Database = require("./config/hrDB");
const Landing = require("./app/routes/landing");
const session = require("express-session");
//for employee Management System
const empRoutes=require('./app/routes/empRoute');

const authRoutes = require("./app/routes/authRoute");
require("./app/middlewares/passport");
require("./app/routes/authRoute");
//module used
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(router);

//route used
app.use("", Landing);

//Database Connection
Database.connection;

//port used
var PORT = process.env.PORT || 3000;
app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});

//Google OAuth
app.use(
  session({
    secret: "vinay",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

//for employee Management System
app.use("/api", empRoutes);
app.use("/auth", authRoutes);
