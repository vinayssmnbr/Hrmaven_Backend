var express = require('express');
const User = require('../models/credential');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");


var mongoose = require('mongoose');
exports.login = async function (req, res) {
  var name = req.body.email;
  var password = req.body.password;
  User.findOne({ $or: [{ email: name }, { username: name }] }).then((user) => {
    if (user) {
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


          res.send({
            message: "login successful",
            token
          });
        } else {
          res.json({
            message: "Invaliddd",
          });
        }
      });
    } else {
      res.json({
        message: "Invalid",
      });
    }
  });
}

exports.getUserProfile = async function (req, res) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    var user;
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY);
    if (decoded.userId) {
      const user = await User.findById(decoded.userId);
      res.send(user);
      return;
    } else {
      const user = await User.findOne({ email: decoded.email });
      res.send(user);
      return;
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);

  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}




//to check that email exist or not
exports.verify_email = async function (email) {
  try {
    var data = await User.find({ email: email });
    if (data) {
      return data;
    } else {
      return "";
    }
  }
  catch (err) {
    return err;
  }
}