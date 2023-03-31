var express = require('express');
const User = require('../models/credential');
const bcrypt = require('bcryptjs');

var mongoose = require('mongoose');
exports.login = async function(req, res) {
    console.log('fkkujhgfdjnhbgvfds');
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
                    } else if (result === true) {
                        res.json({
                            message: 'login successful'
                        })
                    } else {
                        res.json({
                            message: 'incorrect password'
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