var express = require('express');
const User = require('../models/credential');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");


var mongoose = require('mongoose');
exports.login = async function(req, res) {
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
            let token = jwt.sign({ UserID: user._id }, process.env.JWT_TOKEN_KEY, {
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

exports.getUserProfile = async function(req, res) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(token, process.env.JWT_TOKEN_KEY, async function(err, decoded) {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    } else {

      const user = await User.findById(decoded.UserID);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      } else {
        return res.status(200).json(user);
      }
    }
  });
}


//to check that email exist or not
exports.verify_email = async function(email)
{
  try {
    var data = await User.find({email:email});
    if(data){
    return data;
    } else{
      return "";
    }
}
catch (err) {
    return err;
}
}