const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/credential');


const userService = {};


userService.addUser = (req, res) => {

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        confirm: req.body.confirm,
                isFromSignupPage: true // set the flag to true

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
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const { Company, User } = require('../models/credential');

// const userService = {};

// userService.addUser = (req, res) => {
//     // create a new company document
//     const company = new Company({
//         name: req.body.name,   
//         phone: req.body.phone,
//       noOfEmployee: req.body.noOfEmployee,
//       headOffice: req.body.headOffice
//     });
  
//     // save the company document
//     company.save().then((company) => {
//       // create a new user and link it to the company
//       const user = new User({
//         username: req.body.username,
//         email: req.body.email,
//         password: req.body.password,
//         confirm: req.body.confirm,
//         company: company._id,
//         isFromSignupPage: true // set the flag to true
//       });
  
//       // hash the password and confirm fields
//       bcrypt.hash(user.password, 10, function (err, hashedPass) {
//         if (err) {
//           res.json({ error: err });
//         } else {
//           user.password = hashedPass;
//           bcrypt.hash(user.confirm, 10, function (err, hashedConfirm) {
//             if (err) {
//               res.json({ error: err });
//             } else {
//               user.confirm = hashedConfirm;
  
//               // save the user document
//               user.save().then((savedUser) => {
//                 const token = jwt.sign(
//                   { userId: savedUser._id },
//                   process.env.JWT_TOKEN_KEY
//                 );
  
//                 res.json({
//                   message: 'User added successfully',
//                   user: savedUser,
//                   token: token,
//                 });
//               })
//               .catch(error => {
//                 res.json({
//                   message: 'An error occurred while saving the user',
//                   error: error
//                 });
//               });
//             }
//           });
//         }
//       });
//     })
// userService.addUser = (req, res) => {
//     if (req.body.username && req.body.email) {
//       // handle the case where the request contains username and email
//       const user = new User({
//         username: req.body.username,
//         email: req.body.email,
//         password: req.body.password,
//         confirm: req.body.confirm,
//         isFromSignupPage: true // set the flag to true
//       });
  
//       // hash the password and confirm fields
//       bcrypt.hash(user.password, 10, function (err, hashedPass) {
//         if (err) {
//           res.json({ error: err });
//         } else {
//           user.password = hashedPass;
//           bcrypt.hash(user.confirm, 10, function (err, hashedConfirm) {
//             if (err) {
//               res.json({ error: err });
//             } else {
//               user.confirm = hashedConfirm;
  
//               // save the user document
//               user.save().then((savedUser) => {
//                 const token = jwt.sign(
//                   { userId: savedUser._id },
//                   process.env.JWT_TOKEN_KEY
//                 );
  
//                 res.json({
//                   message: 'User added successfully',
//                   user: savedUser,
//                   token: token,
//                 });
//               })
//               .catch(error => {
//                 res.json({
//                   message: 'An error occurred while saving the user',
//                   error: error
//                 });
//               });
//             }
//           });
//         }
//       });
//     } else if (req.body.headOffice && req.body.noOfEmployee) {
//       // handle the case where the request contains headOffice and noOfEmployee
//       const company = new Company({
//         name: req.body.name,
//         phone: req.body.phone,
//         noOfEmployee: req.body.noOfEmployee,
//         headOffice: req.body.headOffice
//       });
  
//       // save the company document
//       company.save().then((company) => {
//         // create a new user and link it to the company
//         const user = new User({
//           username: req.body.username,
//           email: req.body.email,
//           password: req.body.password,
//           confirm: req.body.confirm,
//           company: company._id,
//           isFromSignupPage: true // set the flag to true
//         });
  
//         // hash the password and confirm fields
//         bcrypt.hash(user.password, 10, function (err, hashedPass) {
//           if (err) {
//             res.json({ error: err });
//           } else {
//             user.password = hashedPass;
//             bcrypt.hash(user.confirm, 10, function (err, hashedConfirm) {
//               if (err) {
//                 res.json({ error: err });
//               } else {
//                 user.confirm = hashedConfirm;
  
//                 // save the user document
//                 user.save().then((savedUser) => {
//                   const token = jwt.sign(
//                     { userId: savedUser._id },
//                     process.env.JWT_TOKEN_KEY
//                   );
  
//                   res.json({
//                     message: 'User added successfully',
//                     user: savedUser,
//                     token: token,
//                   });
//                 })
//                 .catch(error => {
//                   res.json({
//                     message: 'An error occurred while saving the user',
//                     error: error
//                   });
//                 });
//               }
//             });
//           }
//         });
//       })
//     .catch((error) => {
//       res.json({
//         message: 'An error occurred while saving the company',
//         error: error,
//       });
//     });
//   };
// }

// module.exports = userService;
