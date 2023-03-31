var express = require('express');
const User = require('../models/credential');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('../services/user');
const help = require('../helper/helper');

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
                    // if (result) {
                    //     let token = jwt.sign({ username: user.username }, process.env.JWT_TOKEN_KEY, { expiresIn: '12h' })
                    //     res.cookie('jwt', token, { httpOnly: true, secure: true, maxAge: 3600000 })

                    //     res.send({
                    //         message: 'login successful',
                    //         token
                    //     })

                    // } else {
                    //     res.json({
                    //         message: 'password does not matched'

                    //     })
                    // }

                })

            } else {
                res.json({
                    message: "no user found"
                })
            }
        })

}

exports.signup = async function(req, res) {
    let user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        confirm: req.body.confirm
    })
    bcrypt.hash(user.password, 10, function(err, hashedPass) {
        user.password = hashedPass
        console.log("Password", user.password)

        if (err) {
            res.json({
                error: err
            })
        }
    })
    bcrypt.hash(user.password, 10, function(err, hashedPass) {
        if (err) {
            res.json({ error: err });
        } else {
            user.password = hashedPass;
            bcrypt.hash(user.confirm, 10, function(err, hashedConfirm) {
                if (err) {
                    res.json({ error: err });
                } else {
                    user.confirm = hashedConfirm;
                    console.log("Password", user.password);
                    console.log("Confirm", user.confirm);

                    // Save the user to the database
                    user.save()
                        .then(savedUser => {
                            res.json({
                                message: 'User added successfully',
                                user: savedUser
                            });
                        })

                    .catch(error => {
                        res.json({
                            message: 'An error occurred while saving the user',
                            error: error
                        });
                    });
                }
            });
        }
    })
}