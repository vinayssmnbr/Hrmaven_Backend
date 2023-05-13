var express = require("express");
const {User} = require("../models/credential");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const help = require('../helper/helper');
const auth = require('../middlewares/authentication');
const service = require('../services/user')
const mailer = require("../../config/mail");
const Empcreditional = require("../models/empcredit");



exports.login = async function(req, res) {
    help.login(req, res);
};
exports.loginemp = async function(req, res) {
  help.loginemp(req, res);
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
  // console.log("token url:-  ", `https://turneazy.com/resetpassword/${token}`)
  console.log("token url: ", `http://localhost:4200/resetpassword/${token}`);

  if (database.length != 0) {
    const user = await User.findOne({ resetPasswordLink: ` https://turneazy.com/resetpassword/${token}` });
    // const user = await User.findOne({ resetPasswordLink: `http://localhost:4200/resetpassword/${token}` });

    if (!newpassword && !confirmPassword && user && user.isResetPasswordLinkUsed) {
      throw new Error("Reset password link has already been used");
    }

    if (newpassword && confirmPassword) {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(newpassword, salt);
      const hashedConfirm = await bcrypt.hash(confirmPassword, salt);
      await User.findOneAndUpdate({ email: database[0].email }, { password: hashedPassword });
      await User.findOneAndUpdate({ email: database[0].email }, { confirm: hashedConfirm });
      await User.findOneAndUpdate({ email: database[0].email }, { isResetPasswordLinkUsed: true });
    }

    if (user && user.isResetPasswordLinkUsed) {
      throw new Error("Reset password link has already been used");
    }

    res.send("changeit");
  }
  //  else {
  //   res.status(400).send({ message: "invalid linkkkk" });
  // }
} catch (error) {
  console.error("error111: ", error);
  if (error.message === "Reset password link has already been used") {
    console.error("error122: ", error.message);
    res.status(400).send({ message: error.message });
  } else if (error.message === "Link has expired") {
    console.error("error133: ", error.message);
    res.status(400).json({ message: "Link has expired" });
  }
}




}

exports.resetemp = async function(req, res) {
  var newpassword = req.body.password;
  
  var token = req.header("auth-token");

  try {
    let email = await tokenDecrypt(token);
    var databaseemp = await help.verify_emp_email(email);
    console.log("databaseemp landing1111: ", databaseemp);
    console.log("token url emp: ", `http://localhost:4200/resetpasswordemp/${token}`);
        
    if (databaseemp.length != 0) {
    // const empcreditional = await Empcreditional.findOne({ resetPasswordLink: `http://localhost:4200/resetpasswordemp/${token}` });
    const empcreditional = await Empcreditional.findOne({ resetPasswordLink: `https://turneazy.com/resetpasswordemp/${token}` });
      if (!newpassword && empcreditional && empcreditional.isEmpResetPasswordLinkUsed) {
        throw new Error("Reset password link has already been used");
      }
    
      if (newpassword) {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(newpassword, salt);
    
        await Empcreditional.findOneAndUpdate({ email: databaseemp[0].email }, { password: hashedPassword });
        await Empcreditional.findOneAndUpdate({ email: databaseemp[0].email }, { isEmpResetPasswordLinkUsed: true });
      }
    
      if (empcreditional && empcreditional.isEmpResetPasswordLinkUsed) {
        throw new Error("Reset password link has already been used");
      }
    
      res.send("changeitemp");
    }
  } catch (error) {
    console.error("error: ", error);
    if (error.message === "Reset password link has already been used") {
      res.status(400).send({ message: error.message });
    } else if (error.message === "Link has expired") {
      res.status(400).json({ message: "Link has expired" });
    }
  }


};



exports.resett = async function(req, res){

  //   var newpassword = req.body.password;
  // var confirmPassword = req.body.confirm;
  // var token = req.header("auth-token");
  // if (!newpassword || !confirmPassword || newpassword.trim() === '' || confirmPassword.trim() === '') {
  //   return res.status(400).send("Invalid password inputs");
  // }
  // var hashedPassword;
  // var hashedConfirm;
  

  // let email = req.params.email
  //  let database = await help.verify_email(email);

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

if (!newpassword || !confirmPassword || newpassword.trim() === '' || confirmPassword.trim() === '') {
  return res.status(400).send("Invalid password inputs");
}

let email = req.params.email
let database = await help.verify_email(email);

if (database.length === 0) {
  return res.status(404).send("Email not found");
}

const saltRounds = 10;
const salt = await bcrypt.genSalt(saltRounds);
const hashedPassword = await bcrypt.hash(newpassword, salt);
const hashedConfirm = await bcrypt.hash(confirmPassword, salt);

await User.findOneAndUpdate({ email: database[0].email }, { password: hashedPassword })
await User.findOneAndUpdate({ email: database[0].email }, { confirm: hashedConfirm })
res.send("changeit");

}

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

}



