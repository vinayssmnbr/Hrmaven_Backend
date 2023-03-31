var express = require('express');
const User = require('../models/credential');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('../services/user');

exports.login = async function(req, res) {
    var email_id = req.body.email
    var name = req.body.username
    var password = req.body.password
    User.findOne({ $or: [{ email: email_id }, { username: name }] })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, function(err, result) {
                    if (err) {
                        res.json({
                            message: 'error'
                        })
                    }

                })

            } else {
                res.json({
                    message: "no user found"
                })
            }
        })

}

exports.signup = async function(req, res) {
    userService.addUser(req, res);

}