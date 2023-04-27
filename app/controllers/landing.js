var express = require("express");
const {User} = require("../models/credential");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const help = require('../helper/helper');
const auth = require('../middlewares/authentication');
const service = require('../services/user')
const mailer = require("../../config/mail");


exports.login = async function(req, res) {
    help.login(req, res);
};

exports.signup = async function(req, res) {
    service.addUser(req, res);
};

exports.addpersonals = async function(req, res) {
  service.addPersonals(req, res);
};
exports.updatehrUser = async function(req, res) {
  service.updateCompany(req, res);
};
exports.putdatacompany = async function(req, res) {
  service.putcompanydata(req, res);
};


exports.getpersonalsdata = async function(req, res) {
  help.getUserPersonals(req, res);
};


exports.auth = async function(req, res) {
    const token = req.headers.authorization.split(' ')[1];
    res.send({
        message: "dashboard",
        token: token
    });
}

exports.getUserProfile = async function(req, res) {

    help.getUserProfile(req, res);
   
  };

exports.getUserProfilepwd = async function(req, res) {

    help.getUserPassword(req, res);
   
  };  

  exports.getUserProfileId = async function(req, res) {

    help.getUserProfileId(req, res);
   
  };  

exports.forgot = async function(req, res) {
    // auth.tokenParser(req, res);
    auth.tokenParser(req, res, function(err) {
      if (err) {
        console.log(err);
        res.status(400).send(err.message);
      } else {
        const token = res.getHeader("reset-password-token");
        res.send({
          message: "reset password link sent",
          token: token
        });
      }
  
    });

}



exports.reset = async function(req, res) {



  var newpassword = req.body.password;
var confirmPassword = req.body.confirm;
var token = req.header("auth-token");

try {
  let email = await tokenDecrypt(token);
  var database = await help.verify_email(email);
  console.log("database landing: ",database);
  console.log("token url: ",`http://localhost:4200/resetpassword/${token}` )
  // console.log("token url: ",`https://turneazy.com/resetpassword/${token}` )

  if (database.length != 0) { 
    // const user = await User.findOne({ resetPasswordLink: `https://turneazy.com/resetpassword/${token}`});
    const user = await User.findOne({ resetPasswordLink: `http://localhost:4200/resetpassword/${token}`});
      

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(newpassword, salt);
    const hashedConfirm = await bcrypt.hash(confirmPassword, salt);
    console.log("database[0].email: ",database[0].email);
    console.log("hashedConfirm: ",hashedConfirm);
    
    await User.findOneAndUpdate({ email: database[0].email }, { password: hashedPassword })
    await User.findOneAndUpdate({ email: database[0].email }, { confirm: hashedConfirm })
    
    await User.findOneAndUpdate({ email: database[0].email }, { isResetPasswordLinkUsed: true })


    if (user && user.isResetPasswordLinkUsed) {
      console.log("user: ", user);
      console.log("user1: ", user.isResetPasswordLinkUsed);
      throw new Error("Reset password link has already been used");
    }


      
    
    res.send("changeit");


  } else {
    res.status(400).send({message: "invalid linkkkk"});
  }

} catch (error) {
  console.log(error);
  if (error.message === "Reset password link has already been used") {
    res.status(400).send({message: error.message});
  } else {
    res.status(400).json({message: "Link has expired"});
  }
}

}

exports.resett = async function(req, res){
  // var newpassword = req.body.password;
  // var confirmPassword = req.body.confirm;
  // var token = req.header("auth-token");
  // var hashedPassword;
  // var hashedConfirm;

  // let email = await tokenDecrypt(token);
  // let database = await help.verify_email(email);
  // console.log(database);
  // if (database.length != 0) {
  //     const saltRounds = 10;
  //     const salt = await bcrypt.genSalt(saltRounds);
  //     const hashedPassword = await bcrypt.hash(newpassword, salt);
  //     const hashedConfirm = await bcrypt.hash(confirmPassword, salt);
  //     console.log(database[0].email);
  //     console.log(hashedConfirm);
  //     await User.findOneAndUpdate({ email: database[0].email }, { password: hashedPassword })
  //     await User.findOneAndUpdate({ email: database[0].email }, { confirm: hashedConfirm })
  //     res.send("changeit");

  // }
    var newpassword = req.body.password;
  var confirmPassword = req.body.confirm;
  var token = req.header("auth-token");
  var hashedPassword;
  var hashedConfirm;

  let email = req.params.email
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

  // try {
  //   const { email,newpassword , confirmPassword } = req.body;

  //   // Find the user by email
  //   const user = await User.findOne({ email });

  //   if (!user) {
  //     return res.status(404).json({ message: 'User not found' });
  //   }

  //   // Generate new salt and hash the new password
  //   const saltRounds = 10;
  //   const salt = await bcrypt.genSalt(saltRounds);
  //   const hashedPassword = await bcrypt.hash(newpassword, salt);
  //   const hashedConfirmPassword = await bcrypt.hash(confirmPassword, salt);

  //   // Update the user's password and confirm password
  //   user.password = hashedPassword;
  //   user.confirm = hashedConfirmPassword;
  //         // res.send("changeit");

  //   await user.save();
  //   res.send("changeit");


  //   // res.json({ message: 'Password updated successfully' });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ message: 'An error occurred' });
  // }

}

exports.showResetPasswordForm = async function(req, res) {
  const token = req.query.token;

  try {
    let email = await tokenDecrypt(token);
    var database = await help.verify_email(email);

    if (database.length != 0) {
      const user = await User.findOne({ resetPasswordLink: `http://localhost:4200/resetpassword/${token}` });

      if (user && user.isResetPasswordLinkUsed) {
        throw new Error("Password reset link has been used");
      }

      // Render the reset password form to the user
      // res.render('reset-password-form', { token: token });
      res.send("changeit");
    } else {
      res.status(400).send({ message: "Invalid link" });
    }

  } catch (error) {
    if (error.message === "Password reset link has been used") {
      res.status(400).send({ message: error.message });
    } else {
      res.status(400).send({ message: "Link has expired" });
    }
  }
};
// var newpassword = req.body.password;
// var confirmPassword = req.body.confirm;
// var token = req.header("auth-token");

// try {
//   let email = await tokenDecrypt(token);
//   var database = await help.verify_email(email);
//   console.log("database landing: ", database);
//   console.log("token url: ", `http://localhost:4200/resetpassword/${token}`);

//   if (database.length != 0) {
//     const user = await User.findOne({ resetPasswordLink: `http://localhost:4200/resetpassword/${token}` });
//     if (user) {
  
//       if (user.isResetPasswordLinkUsed) {
//         throw new Error("Reset password link has already been used");
//       }
//     const saltRounds = 10;
//     const salt = await bcrypt.genSalt(saltRounds);
//     const hashedPassword = await bcrypt.hash(newpassword, salt);
//     const hashedConfirm = await bcrypt.hash(confirmPassword, salt);
//     console.log("database[0].email: ",database[0].email);
//     console.log("hashedConfirm: ",hashedConfirm);

    
//     await User.findOneAndUpdate({ email: database[0].email }, { password: hashedPassword })
//     await User.findOneAndUpdate({ email: database[0].email }, { confirm: hashedConfirm })
//     await User.findOneAndUpdate({ email: database[0].email }, { isResetPasswordLinkUsed: true })

//     res.send("changeit");
//       } else {
//       res.status(400).send({ message: "Invalid link" });
//     }
//   } else {
//     res.status(400).send({ message: "Invalid link" });
//   }

// } catch (error) {
//   if (error.message === "Reset password link has already been used") {
//     res.status(400).send({ message: error.message });
//   } else {
//     res.status(400).send({ message: "Link has expired" });
//   }
// }

// }


const tokenDecrypt = async (token,) => {  

 
  try {
    const decrypt = jwt.verify(token, process.env.JWT_TOKEN_KEY);
    if (decrypt.email == "") {
      throw new Error("Link has expired");
    } else if (decrypt.exp < Math.floor(Date.now() / 1000)) {
      throw new Error("Link has expired");
    } else {
      return decrypt.email;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Link has expired");
  } 

  // const decrypt = jwt.verify(token, process.env.JWT_TOKEN_KEY);
  // if (decrypt.email == "") {
  //   return decrypt.email;
  //     // res.send("invalid link");
  // } else {
  //     // return decrypt.email;
  //     res.send("invalid link");

  // }
}


// exports.sendResetPasswordLink = async function(req, res) {
//   var email = req.body.email;
//   var validate = await help.verify_email(email);
//   if (validate.length == 0) {
//     res.send("error in the email");
//   } else {
//     console.log(validate[0].email);
//     email = validate[0].email;
//   }

//   const payload = {
//     email: email,
//     // set the expiry time to 5 minute from now
//     exp: Math.floor(Date.now() / 1000) + (5 * 60)
//   };
//   const secret = process.env.JWT_TOKEN_KEY;
//   const token = jwt.sign(payload, secret);
//   console.log("t:  ",token);

//   // Check if the reset password link has already been used
//   const user = await User.findOne({ email: email });
//   if (user && user.isResetPasswordLinkUsed) {
//     return res.status(400).send({ message: "Reset password link has already been used" });
//   }

//   const link = `http://localhost:4200/resetpassword/${token}`;

//   // Set the reset password link and isResetPasswordLinkUsed flag in the user's document
//   await User.findOneAndUpdate({ email: email }, {
//     resetPasswordLink: link,
//     isResetPasswordLinkUsed: false,
//   });

//   var mailResponse = await mailer.mail(
//     email,
//     "Reset password link for HRMaven ",
//     `${link}  Link valid for only 5min `
//   );
//   console.log(mailResponse);
//   res.send({
//     message: "email sent",
//     token: token
//   });
// };


