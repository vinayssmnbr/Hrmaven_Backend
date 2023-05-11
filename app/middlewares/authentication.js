const jwt = require("jsonwebtoken");
const { User } = require("../models/credential");
const help = require("../helper/helper");
const mailer = require("../../config/mail");
const Empcreditional = require("../models/empcredit");


exports.verify = async function (req, res, next) {
  console.log("In Verify Token");
  console.log("abcc", req.headers);
  const token = req.headers.authorization?.split(" ")[1];
  console.log("abc", token);
  if (!token) return res.status(401).send("Access Denied !");

  try {
    const UserID = await jwt.verify(token, process.env.JWT_TOKEN_KEY);
    console.log("ue", UserID);
    if (!UserID) {
      return res.send("tst");
    }
    req.user = UserID;
    next();
  } catch (error) {
    console.log("error auth:",error);
    res.status(400).send("Invalid token !");
  }
};

exports.tokenParser = async function (req, res, next) {
  console.log("inside tokenParser:", req.body.email);
  var email;
  var validate = await help.verify_email(req.body.email);
  console.log("validate: ", validate);
  if (validate.length == 0) {
    res.send("error in the email");
  } else {
    console.log(validate[0].email);
    email = validate[0].email;
  }

  const payload = {
    email: email,
    // set the expiry time to 5 minute from now
    exp: Math.floor(Date.now() / 1000) + 5 * 60,
  };
  const secret = process.env.JWT_TOKEN_KEY;
  const token = jwt.sign(payload, secret);
  console.log("t:  ", token);
  // const link = 'https://turneazy.com/resetpassword/' + token;
  // const link = `https://turneazy.com/resetpassword/${token}`;
  const link = `http://localhost:4200/resetpassword/${token}`;
  await User.findOneAndUpdate(
    { email: email },
    {
      resetPasswordLink: link,
      // $push: { resetPasswordLinks: link },
      isResetPasswordLinkUsed: false,
    }
  );
  console.log(link);
  var mailResponse = await mailer.mail(
    email,
    "Reset password link for HRMaven ",
    `${link}  Link valid for only 5min `
  );
  console.log(mailResponse);
  res.send({
    message: "email sent",
    token: token,
  });
//   console.log("inside tokenParser:", req.body.email);
// var email;
// var validate = await help.verify_email(req.body.email);
// console.log("validate: ", validate);
// if (validate.length == 0) {
//   return res.send("error in the email");
// } else {
//   console.log(validate[0].email);
//   email = validate[0].email;
// }

// const payload = {
//   email: email,
//   // set the expiry time to 5 minutes from now
//   exp: Math.floor(Date.now() / 1000) + 5 * 60,
// };
// const secret = process.env.JWT_TOKEN_KEY;
// const token = jwt.sign(payload, secret);
// console.log("t:  ", token);
// // const link = 'https://turneazy.com/resetpassword/' + token;
// // const link = `https://turneazy.com/resetpassword/${token}`;
// const link = `http://localhost:4200/resetpassword/${token}`;

// var mailResponse;
// if (validate.length > 0) {
//   await User.findOneAndUpdate(
//     { email: email },
//     {
//       resetPasswordLink: link,
//       // $push: { resetPasswordLinks: link },
//       isResetPasswordLinkUsed: false,
//     }
//   );
//   console.log(link);
//   mailResponse = await mailer.mail(
//     email,
//     "Reset password link for HRMaven",
//     `${link}  Link valid for only 5 minutes`
//   );
// } else {
//   mailResponse = { success: false, message: "Email not found" };
// }
// console.log(mailResponse);
// return res.send({
//   message: "email sent",
//   token: token,
// });

};


exports.empTokenParser = async function (req, res, next) {
  const { email } = req.body;

  // Verify the employee's email address
  const validate = await help.verify_emp_email(email);
  if (validate.length === 0) {
    res.status(400).send({ message: "Invalid email address" });
    return;
  }
  const validatedEmail = validate[0].email;

  // Generate a JWT token for the reset password link
  const payload = {
    email: validatedEmail,
    exp: Math.floor(Date.now() / 1000) + 5 * 60,
  };
  const secret = process.env.JWT_TOKEN_KEY;
  const token = jwt.sign(payload, secret);

  // Generate the reset password link and save it to the database
  const link = `http://localhost:4200/resetpasswordemp/${token}`;
  try {
    const empCredential = await Empcreditional.findOneAndUpdate(
      { email: validatedEmail },
      { resetPasswordLink: link, isEmpResetPasswordLinkUsed: false },
      { upsert: true }
    );
    console.log("empCredential:", empCredential);
  } catch (error) {
    console.error("Error saving reset password link to database:", error);
    res.status(500).send({ message: "Internal server error" });
    return;
  }

  // Add the reset password token to the response headers
  res.setHeader("reset-password-token", token);

  // Call the next middleware
  next();

// console.log("inside empTokenParser:", req.body.email);
//   var email;
//   var validate = await help.verify_emp_email(req.body.email);
//   console.log("validate: ", validate);
//   if (validate.length == 0) {
//     res.send("error in the email");
//   } else {
//     console.log(validate[0].email);
//     email = validate[0].email;
//   }

//   const payload = {
//     email: email,
//     // set the expiry time to 5 minute from now
//     exp: Math.floor(Date.now() / 1000) + 5 * 60,
//   };
//   const secret = process.env.JWT_TOKEN_KEY;
//   const token = jwt.sign(payload, secret);
//   console.log("emptoken:  ", token);

//   const link = `http://localhost:4200/resetpasswordemp/${token}`;

//   try {
//     // Store the reset password link in the database
//     const empCredential = await Empcreditional.findOneAndUpdate(
//       { email: email },
//       { resetPasswordLink: link, isEmpResetPasswordLinkUsed: false },
//       { upsert: true }
//     );
//     console.log("empCredential:", empCredential);
//   } catch (error) {
//     console.error("Error saving reset password link to database:", error);
//   }

//   console.log(link);
//   var mailResponse = await sendMail(
//     email,
//     "Reset password link for HRMaven ",
//     `${link}  Link valid for only 5min `
//   );
//   console.log(mailResponse);
//   res.send({
//     message: "email sent",
//     token: token,
//   });
};



