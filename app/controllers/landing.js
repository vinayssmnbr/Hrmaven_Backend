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
    res.send({
        message: "dashboard"
    });
}

exports.forgot = async function(req, res) {
    auth.tokenParser(req, res);
}

exports.reset = async function(req, res) {
    var newpassword = req.body.password;
    var confirmPassword = req.body.confirm;
    var token = req.header("auth-token");
    var hashedPassword;
    var hashedConfirm;

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

    }

}

function tokenDecrypt(token) {
    const decrypt = jwt.verify(token, process.env.JWT_TOKEN_KEY);
    if (decrypt.email == "") {
        res.send("invalid link");
    } else {
        return decrypt.email;
    }
}