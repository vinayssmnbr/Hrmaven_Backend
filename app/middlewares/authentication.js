const jwt = require("jsonwebtoken");
const User = require("../models/credential");
const help = require("../helper/helper");
const mailer = require("../../config/mail");

exports.verify = async function(req,res,next)
{
  console.log('In Verify Token') 
  const token = req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).send('Access Denied !');
  console.log("abc",token);

  try 
  {
      const UserID= await jwt.verify(token, process.env.JWT_TOKEN_KEY);
      console.log("ue",UserID)
      if(!UserID){
          return res.send("tst")

      }
      req.user = UserID;  
      next();
  } 
  catch (error) 
  
  {
    console.log(error)
      res.status(400).send('Invalid token !');
  }
};

exports.tokenParser = async function (req, res, next) {
  console.log(req.body.email);
  var email;
  var validate = await help.verify_email(req.body.email);
  console.log(validate);
  if (validate.length == 0) {
    res.send("error in the email");
  } else {
    console.log(validate[0].email);
    email = validate[0].email;
    let token = jwt.sign(
      { email: validate[0].email },
      process.env.JWT_TOKEN_KEY,
      {
        expiresIn: "12h",
      }
    );
    console.log(token);

    var link = "https://turneazy.com/resetpassword/" + token;
    console.log(link);
    var mailResponse = await mailer.mail(
      email,
      "Reset password link for HRMaven",
      link
    );
    console.log(mailResponse);
    res.send("email sent");
  }
};
