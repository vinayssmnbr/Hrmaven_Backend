var express = require("express");
const User = require("../models/credential");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const help = require('../helper/helper');
const auth = require('../middlewares/authentication');
const service = require('../services/user')

exports.login = async function(req, res) {
    help.login(req, res);
};

exports.signup = async function(req, res) {
    service.addUser(req, res);
};

exports.auth = async function(req, res) {
    const token = req.headers.authorization.split(' ')[1];
    res.send({
        message: "dashboard",
        token: token
    });
}

exports.getUserProfile = async function(req, res) {

    help.getUserProfile(req, res);
   
  };

  exports.getUserProfileId = async function(req, res) {

    help.getUserProfileId(req, res);
   
  };  

exports.forgot = async function(req, res) {
    // auth.tokenParser(req, res);
    auth.tokenParser(req, res, function(err) {
      if (err) {
        console.log(err);
        res.status(400).send(err.message);
      } else {
        const token = res.getHeader("reset-password-token");
        res.send({
          message: "reset password link sent",
          token: token
        });
      }
    });
}

exports.reset = async function(req, res) {

  var newpassword = req.body.password;
  var confirmPassword = req.body.confirm;
  var token = req.header("auth-token");

  try {
    let email = await tokenDecrypt(token);
    let database = await help.verify_email(email);
    console.log(database);

    if (database.length != 0) {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(newpassword, salt);
      const hashedConfirm = await bcrypt.hash(confirmPassword, salt);
      console.log(database[0].email);
      console.log(hashedConfirm);
      await User.findOneAndUpdate({ email: database[0].email }, { password: hashedPassword })
      await User.findOneAndUpdate({ email: database[0].email }, { confirm: hashedConfirm })
      res.send("changeit");
    } else {
      res.status(400).send({message: "invalid linkkkk"});
    }
  } catch (error) {
    console.log("error1: ",error);
    res.status(400).json({message: "Link has expired"});
  }
  // var newpassword = req.body.password;
  // var confirmPassword = req.body.confirm;
  // var token = req.header("auth-token");

  // try {
  //   // verify the token and get the email and resetPasswordTokenId
  //   const { email, resetPasswordTokenId } = await tokenDecrypt(token);

  //   // check if the reset password link has already been used
  //   const user = await User.findOne({ email: email, resetPasswordTokenId: resetPasswordTokenId });
  //   if (!user) {
  //     throw new Error("Invalid reset link");
  //   }
  //   if (user.resetPasswordTokenId === null) {
  //     throw new Error("Reset link has already been used");
  //   }

  //   // hash the new password and update the user record
  //   const saltRounds = 10;
  //   const salt = await bcrypt.genSalt(saltRounds);
  //   const hashedPassword = await bcrypt.hash(newpassword, salt);
  //   const hashedConfirm = await bcrypt.hash(confirmPassword, salt);
  //   await User.findOneAndUpdate({ email: email }, { password: hashedPassword, confirm: hashedConfirm, resetPasswordTokenId: null });

  //   res.send("Password reset successfully");
  // } catch (error) {
  //   console.log("error1: ",error);
  //   res.status(400).json({message: error.message});
  // }

  
}




const tokenDecrypt = async (token) => {  

    try {
      const decrypt = jwt.verify(token, process.env.JWT_TOKEN_KEY);
      if (decrypt.email == "") {
        throw new Error("invalid link");
      } else if (decrypt.exp < Math.floor(Date.now() / 1000)) {
        throw new Error("Link has expired");
      } else {
        return decrypt.email;
      }
    } catch (error) {
      if (error.message === "Link has expired") {
        throw new Error("Link has expired. Please request a new reset link.");
      } else {
        console.log(error);
        throw new Error("Invalid reset link.");
      }
    } 
  
    // const decrypt = jwt.verify(token, process.env.JWT_TOKEN_KEY);
    // if (decrypt.email == "") {
    //     res.send("invalid link");
    // } else {
    //     return decrypt.email;
    // }
}
