var express = require("express");
const User = require("../models/credential");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userService = require('../services/user')




exports.signup = async function(req, res) {
    userService.addUser(req, res);
};