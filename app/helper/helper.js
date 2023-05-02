//helper.js
var express = require("express");
const { User } = require("../models/credential");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const EmployeeModel = require("../models/employee/employeeModel");

var mongoose = require("mongoose");
exports.login = async function (req, res) {
  var name = req.body.email;
  var password = req.body.password;

  try {
    const user = await User.findOne({
      $or: [{ email: name }, { username: name }],
    });
    if (user) {
      const employee = await EmployeeModel.findOne({ professionalemail: name });
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
            token,
            empId:user.empId
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
  const { email } = req.params;

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
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const password = user.password;

    return res.status(200).send({ password });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Error fetching user password" });
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
