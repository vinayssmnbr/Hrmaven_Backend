//helper.js
var express = require("express");
const { User } = require("../models/credential");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const EmployeeModel = require("../models/employee/employeeModel");
const Empcreditional = require("../models/empcredit");
var mongoose = require("mongoose");
var ObjectId = require("mongodb").ObjectId;

exports.login = async function (req, res) {
  var name = req.body.email.toLowerCase();
  var password = req.body.password;


  try {
    const user = await User.findOne({
      $or: [{ email: name }, { username: name }],
    });
    if (user) {
      // const employee = await EmployeeModel.findOne({ professionalemail: name });
      // if (employee && employee.status === 'active') {
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          res.json({
            message: "error",
          });
        }
        if (result) {
          let token = jwt.sign(
            { userId: user._id },
            process.env.JWT_TOKEN_KEY,
            {
              expiresIn: "12h",
            }
          );
          res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000,
          });
          res.json({
            message: "login successful",
            _id: user._id,
            username: user.username,
            role: "hr",
            token,
            empId: user.empId,
            personalDataSubmitted: user.personalDataSubmitted // Add this line
          });
        } else {
          res.json({
            message: "Invalid",
          });
        }
      });
    } else {
      res.json({
        message: "Employee email or status invalid",
      });
    }
  } catch (err) {
    res.json({
      message: "error",
    });
  }
};

exports.loginemp = async function (req, res) {
  var name = req.body.email.toLowerCase();
  var password = req.body.password;

  const employee = await EmployeeModel.findOne({ professionalemail: name });
  if (employee == null) {
    res.json({
      message: "Invalid",
    });
    return;
  }
  if (employee.status == "active" && employee != null) {
    const user = await Empcreditional.findOne({
      $or: [{ email: name }, { professional: name }],
    });

    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        res.json({
          message: "error",
        });
      }
      if (result) {
        let token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN_KEY, {
          expiresIn: "12h",
        });
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          maxAge: 3600000,
        });
        res.json({
          message: "login successful",
          role: "employee",
          token,
          empId: employee._id,
        });
      } else {
        res.json({
          message: "Invalid",
        });
      }
    });
  } else {
    res.json({
      message: "Employee email or status invalid",
    });
  }
};

exports.getUserProfile = async function (req, res) {
  // const authHeader = req.headers['authorization'];
  // const token = authHeader && authHeader.split(' ')[1];

  // if (!token) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }

  // try {
  //   var user;
  //   const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY);
  //   if (decoded.userId) {
  //     const user = await User.findById(decoded.userId);
  //     res.send(user);
  //     return;
  //   } else {
  //     const user = await User.findOne({ email: decoded.email });
  //     res.send(user);
  //     return;
  //   }

  // } catch (err) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }
  if (req.headers.role == "employee") {
    const user = await EmployeeModel.find({
      _id: new ObjectId(req.headers.id),
    });
    console.log();
    res.send(user);
    return;
  }
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    var user;
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY);
    if (decoded.userId) {
      const user = await User.findById(decoded.userId).populate("personaldata");
      res.send(user);
      return;
    } else {
      const user = await User.findOne({ email: decoded.email }).populate(
        "personaldata"
      );
      res.send(user);
      return;
    }
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

exports.getUserPersonals = async function (req, res) {
  const  email  = req.params.email;

  try {
    const user = await User.findOne({ email: email }).select("personaldata");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const personaldata = user.personaldata;
    const userId = user._id;

    return res.status(200).send({ personaldata });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "Error fetching user personal data" });
  }
};

exports.getUserPassword = async function (req, res) {
  // const userId = req.params.id;

  // try {
  //   const user = await User.findById(userId);
  //   if (!user) {
  //     return res.status(404).send({ message: "User not found" });
  //   }

  //   const password = user.password;

  //   return res.status(200).send({ password });
  // } catch (err) {
  //   console.error(err);
  //   return res.status(500).send({ message: "Error fetching user password" });
  // }.

  const { oldpassword } = req.body;
  const email = req.params.email;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(oldpassword, user.password);

    if (!passwordMatch) {
      return res.status(401).send({ message: "Incorrect password" });
    }

    return res.status(200).send({ message: "Password matches" });
  } catch (err) {
    console.error(err);
    return res.status(404).send({ message: "Error fetching user password" });
  }
};

//to check that email exist or not
exports.verify_email = async function (email) {
  try {
    var data = await User.find({ email: email });
    if (data) {
      return data;
    } else {
      return "";
    }
  } catch (err) {
    return err;
  }
};
