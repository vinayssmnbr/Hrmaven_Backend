const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/credential');


const userService = {};


userService.addUser = (req, res) => {

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        confirm: req.body.confirm
    });


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


                    user.save()
                        .then(savedUser => {

                            const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_TOKEN_KEY);


                            res.json({
                                message: 'User added successfully',
                                user: savedUser,
                                token: token
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
    });
};


module.exports = userService;