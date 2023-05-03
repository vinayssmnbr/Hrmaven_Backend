// require("dotenv").config();
// var express = require("express");
// var app = express();
// const mongoose = require("mongoose");
// const cors = require("cors");
// const Database = require("./config/hrDB");
// const Landing = require("./app/routes/landing");
// const session = require("express-session");
// const { Parser } = require("json2csv");


// //for employee Management System
// const empRoutes = require('./app/routes/empRoute');
// const attendanceRoutes = require('./app/routes/attendanceRoutes');
// const authRoutes = require("./app/routes/authRoute");
// const employeespecificdetails = require('./app/routes/employeespecific')

// const jobRoutes = require('./app/routes/jobRoutes');
// //email data find
// const emailAll = require('./app/routes/findemail');
// var router = express.Router();

// const bodyParser = require('body-parser');
// require("./app/middlewares/passport");
// require("./app/routes/authRoute");
// const leaveRoute = require("./app/routes/leaveRoute")
// //module used



// app.use(express.json());
// app.use(cors());
// app.use(express.urlencoded({ extended: true }));
// app.use(router);
// app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));



// //Database Connection
// Database.connection;

// //port used
// var PORT = process.env.PORT || 3000;
// app.listen(PORT, function (err) {
//     if (err) console.log(err);
//     console.log("Server listening on PORT", PORT);
// });

// //Google OAuth
// app.use(
//     session({
//         secret: "vinay",
//         resave: false,
//         saveUninitialized: true,
//         cookie: { secure: true },
//     })
// );

// //for employee Management System
// app.use("/api", empRoutes);
// app.use("/auth", authRoutes);
// app.use("/api/leave", leaveRoute)
// app.use("/api", empRoutes);
// app.use("", Landing);
// app.use('/attendance', attendanceRoutes);
// app.use("/user", empRoutes);
// app.use("/user", empRoutes);




// app.use("/getemployee", employeespecificdetails)

// app.use("/getemails", emailAll);
// app.use('/api', jobRoutes);

// module.exports = app;

require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
const session = require("express-session");
const Database = require("./config/hrDB");
const Landing = require("./app/routes/landing");

// Employee Management System Routes
const empRoutes = require('./app/routes/empRoute');
const attendanceRoutes = require('./app/routes/attendanceRoutes');
const authRoutes = require("./app/routes/authRoute");
const employeespecificdetails = require('./app/routes/employeespecific');
const leaveRoute = require("./app/routes/leaveRoute");
const jobRoutes = require('./app/routes/jobRoutes');
const emailAll = require('./app/routes/findemail');

// Database Connection
Database.connection;

// Port
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session
app.use(session({
  secret: "vinay",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
}));

// Routes
app.use("", Landing);
app.use("/auth", authRoutes);
app.use("/api/leave", leaveRoute);
app.use("/api", empRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/user", empRoutes);
app.use("/getemployee", employeespecificdetails);
app.use("/getemails", emailAll);
app.use('/api', jobRoutes);

// Start the server
app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});
