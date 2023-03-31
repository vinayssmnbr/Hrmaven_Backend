var express = require("express");
const User = require("../models/credential");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
          let token = jwt.sign({ UserID: user._id }, process.env.JWT_TOKEN_KEY, {
            expiresIn: "12h",
          });
          res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000,
          });

          res.send({
            message: "login successful",
            token,
          });
        } else {
          res.json({
            message: "password does not matched",
          });
        }
      });
    } else {
      res.json({
        message: "no user found",
      });
    }
  });
};

exports.signup = async function (req, res) {
  let user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    confirm: req.body.confirm,
  });

  bcrypt.hash(user.password, 10, function (err, hashedPass) {
    if (err) {
      res.json({ error: err });
    } else {
      user.password = hashedPass;
      bcrypt.hash(user.confirm, 10, function (err, hashedConfirm) {
        if (err) {
          res.json({ error: err });
        } else {
          user.confirm = hashedConfirm;
          console.log("Password", user.password);
          console.log("Confirm", user.confirm);

          // Save the user to the database
          user
            .save()
            .then((savedUser) => {
              // Generate a JWT token
              const token = jwt.sign(
                { UserID: savedUser._id },
                process.env.JWT_TOKEN_KEY, 
                {
                    expiresIn: "12h",
                  }
              );

              // Return the user and token in a JSON response
              res.json({
                message: "User added successfully",
                user: savedUser,
                token: token,
              });
            })
            .catch((error) => {
              res.json({
                message: "An error occurred while saving the user",
                error: error,
              });
            });
        }
      });
    }
  });
};

exports.auth = async function (req, res) {
   res.send({
    message: "dashboard"
   });
}
