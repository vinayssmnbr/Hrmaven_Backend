var express = require("express");
const User = require("../models/credential");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userService = require('../services/user')
const help = require('../helper/helper');

exports.login = async function (req, res) {
 help.login(req, res);
};

exports.signup = async function (req, res) {
  userService.addUser(req, res);
};

exports.auth = async function (req, res) {
   res.send({
    message: "dashboard"
   });
}
