const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/credential");
const sendMail = require("../../config/mail");
const userService = {};

userService.addUser = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    // confirm: req.body.confirm,
  });
  bcrypt.hash(user.password, 10, function (err, hashedPass) {
    if (err) {
      res.json({ error: err });
    } else {
      user.password = hashedPass;

      user
        .save()
        .then(async (savedUser) => {
          const token = jwt.sign(
            { userId: savedUser._id },
            process.env.JWT_TOKEN_KEY
          );
          const text = `<head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="x-apple-disable-message-reformatting">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title>Newsletter</title>
        </head>
        <body style="text-align: center; margin: 0; padding-top: 10px; padding-bottom: 10px; padding-left: 0; padding-right: 0; -webkit-text-size-adjust: 100%; color: #00000" align="center">
          <div style="text-align: center;  width:100% height:100%  background-color: #fff;">
              <table align="center" style=" text-align: justify; vertical-align: top; width: 100%; height:100%; background-color: #ffffff;" width="600">
                <tbody>
                  <tr>
                    <tr>
                      <td style="display:flex; align-items:center; justify-content:center; margin-top:50px; gap:5px;">
                        <a href="https://turneazy.com/login" style="color: #2f2c9f; font-weight:700; font-size:24px; text-decoration:none" ><img src="https://turneazy.com/assets/images/logo.png" alt="" style="height:30px; width:30px;">
                          HRmaven
                        </a>
                      </td>
                      </tr>
                    <td style="width: 596px; vertical-align: top; padding: 30px 60px; >
        
                      <p style="font-size: 14px; line-height: 100%; font-family: 'Neuton', font-weight: 400; text-decoration: none; color: #444444;">Dear ${req.body.username},</p>
        
                      <p style="font-size: 14px; line-height: 100%; font-family: 'Neuton',  font-weight: 400; text-decoration: none; color: #444444;">On behalf of the HRMaven team, I would like to extend you a warm welcome to our platform! We are thrilled to have you on board and look forward to work with you.</p>
        
                      <p style="font-size: 14px; line-height: 100%; font-family: 'Neuton'; font-weight: 400; text-decoration: none; color: #444444;">With HRMaven, you will be able to streamline your HR processes, automate your administrative tasks, and make data-driven decisions. We believe that our platform will help you manage your workforce more efficiently and effectively, so that you can focus on what really matters - building a strong, engaged and motivated team.</p>
        
                      <p style="font-size: 14px; line-height: 100%; font-family: 'Neuton',  font-weight: 400; text-decoration: none; color: #444444;">
                        Our support team is always available to assist you with any questions or issues that you may encounter. You just need to drop a mail at noreply@hrmaven.com.</p>
        
                      <p style="font-size: 14px; line-height: 100%; font-family: 'Neuton', font-weight: 400; text-decoration: none; color: #444444;">Once again, welcome to HRMaven! We are excited to have you as a part of our community and look forward to support your HR journey.</p>
        
                      <p style="font-size: 14px; line-height: 100%; font-family: 'Neuton' font-weight: 400; text-decoration: none; margin-top: 20px; color: #444444;">Best regards,</p>
        
                      <p style="font-size: 14px; line-height: 100%; font-family: 'Neuton'; font-weight: 400; margin-top: -10px;  text-decoration: none; color: #444444;">${req.body.username}</p>
                      
                      <p style="font-size: 14px; line-height: 100%; font-family: 'Neuton'; font-weight: 400; margin-top: -10px;  text-decoration: none; color: #444444;">HRMaven Team</p>
        
                      <p style="font-size: 14px; line-height: 100%; font-family: 'Neuton' font-weight: 400; margin-top: -10px; text-decoration: none; color: #444444;">Contact No: +91 9875463210</p>
        
                      <!--               <p style="font-size: 15px; line-height: 24px; font-family: 'Helvetica', Arial, sans-serif; font-weight: 400; text-decoration: none; color: #919293;">You can download this template <a target="_blank" style="text-decoration: underline; color: #000000;" href="https://fullsphere.co.uk/misc/free-template/html-email-template.zip" download="HTML Email Template"><u>here</u></a></p> -->
        
                    </td>
                  </tr>
                </tbody>
              </table>
          </div>
        </body>`;
          const to = req.body.email;
          const subject = "Welcome to HRmaven";
          await sendMail.mail(to, subject, text);
          res.json({
            message: "User added successfully",
            user: savedUser,
            token: token,
            _id: savedUser._id,
            role: "hr",
            personalDataSubmitted: user.personalDataSubmitted,
            first: true, // Add this line
          });
        })
        .catch((error) => {
          // console.log(savedUser);
          console.log("error singup:", error);
          res.json({
            message: "An error occurred while saving the user",
            error: error,
          });
        });
    }
  });

  // bcrypt.hash(user.password, 10, function(err, hashedPass) {
  //     if (err) {
  //         res.json({ error: err });
  //     } else {
  //         user.password = hashedPass;
  //         bcrypt.hash(user.confirm, 10, function(err, hashedConfirm) {
  //             if (err) {
  //               console.log("error singup:",err)
  //                 res.json({ error: err });
  //             } else {
  //                 user.confirm = hashedConfirm;

  //                 user.save()
  //                     .then(savedUser => {
  //                       console.log(savedUser);
  //                         const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_TOKEN_KEY);

  //                         res.json({
  //                             message: 'User added successfully',
  //                             user: savedUser,
  //                             token: token,
  //                             _id:savedUser._id,
  //                             role:"hr"
  //                         });
  //                     })
  //                     .catch(error => {
  //                       // console.log(savedUser);
  //                       console.log("error singup:",error)
  //                         res.json({
  //                             message: 'An error occurred while saving the user',
  //                             error: error
  //                         });
  //                     });
  //             }
  //         });
  //     }
  // });
};

userService.putcompanydata = async (req, res) => {
  const { email } = req.params;
  const { name, phone, domain, headOffice, description, url } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      {
        $set: {
          "personaldata.name": name,
          "personaldata.phone": phone,
          "personaldata.domain": domain,
          "personaldata.headOffice": headOffice,
          "personaldata.description": description,
          "personaldata.url": url,
          personalDataSubmitted: true,
        },
      },
      { new: true }
    ).populate("personaldata");

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred while adding the user" });
  }
};

userService.updateCompany = async (req, res) => {
  const { email } = req.params;
  const update = {};

  const fieldsToUpdate = [
    "phone",
    "headOffice",
    "description",
    "url",
    "personalemail",
  ];

  for (const field of fieldsToUpdate) {
    if (req.body[field]) {
      update[`personaldata.${field}`] = req.body[field];
    }
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { $set: update },
      { new: true }
    ).populate("personaldata");

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred while updating the user" });
  }
};
module.exports = userService;

// userService.updateCompany
// const { email } = req.params;
// const update = {};

// // check which fields are present in the request body and add them to the update object
// if (req.body.name) {
//   update['personaldata.name'] = req.body.name;
// }
// if (req.body.phone) {
//   update['personaldata.phone'] = req.body.phone;
// }
// if (req.body.noOfEmployee) {
//   update['personaldata.noOfEmployee'] = req.body.noOfEmployee;
// }
// if (req.body.headOffice) {
//   update['personaldata.headOffice'] = req.body.headOffice;
// }
// if (req.body.description) {
//   update['personaldata.description'] = req.body.description;
// }

// try {
//   const updatedUser = await User.findOneAndUpdate(
//     { email: email },
//     { $set: update },
//     { new: true }
//   ).populate('personaldata');

//   res.status(200).json(updatedUser);
// } catch (err) {
//   console.error(err);
//   res.status(500).json({ message: 'An error occurred while updating the user' });
// }
// const { email } = req.params;
//   const update = {};

//   // check which fields are present in the request body and add them to the update object
//   if (req.body.name) {
//     update['personaldata.name'] = req.body.name;
//   }
//   if (req.body.phone) {
//     update['personaldata.phone'] = req.body.phone;
//   }
//   if (req.body.noOfEmployee) {
//     update['personaldata.noOfEmployee'] = req.body.noOfEmployee;
//   }
//   if (req.body.headOffice) {
//     update['personaldata.headOffice'] = req.body.headOffice;
//   }
//   if (req.body.description) {
//     update['personaldata.description'] = req.body.description;
//   }
//   if (req.body.profileimage) {
//     update['personaldata.profileimage'] = req.body.profileimage;
//   }

//   try {
//     const updatedUser = await User.findOneAndUpdate(
//       { email: email },
//       { $set: update },
//       { new: true }
//     ).populate('personaldata');

//     res.status(200).json(updatedUser);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'An error occurred while updating the user' });
//   }

// };

// module.exports = userService;

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
