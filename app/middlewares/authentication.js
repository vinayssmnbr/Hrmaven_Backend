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
  // console.log("inside tokenParser:",req.body.email);
  // var email;
  // var validate = await help.verify_email(req.body.email);
  // console.log("v: ",validate);
  // if (validate.length == 0) {
  //   res.send("error in the email");
  // } else {
  //   console.log(validate[0].email);
  //   email = validate[0].email;
  // }
  
  // const payload = {
  //   email: email,
  //   // set the expiry time to 5 minute from now
  //   exp: Math.floor(Date.now() / 1000) + (5 * 60)
  // };
  // const secret = process.env.JWT_TOKEN_KEY;
  // const token = jwt.sign(payload, secret);
  // console.log("t:  ",token);
  
  // const link = 'https://turneazy.com/resetpassword/' + token;
  // // const link = `http://localhost:4200/resetpassword/${token}`;
  // console.log(link);
  // var mailResponse = await mailer.mail(
  //   email,
  //   "Reset password link for HRMaven ",
  //   `${link}  Link valid for only 5min `
  // );
  // console.log(mailResponse);
  // res.send({
  //   message: "email sent",
  //   token: token
  // });

    // ---------new solution
  console.log("inside tokenParser:",req.body.email);
  var email;
  var validate = await help.verify_email(req.body.email);
  console.log("validate: ",validate);
  if (validate.length == 0) {
    res.send("error in the email");
  } else {
    console.log(validate[0].email);
    email = validate[0].email;
  }
  
  const payload = {
    email: email,
    // set the expiry time to 5 minute from now
    exp: Math.floor(Date.now() / 1000) + (5 * 60)
  };
  const secret = process.env.JWT_TOKEN_KEY;
  const token = jwt.sign(payload, secret);
  console.log("t:  ",token);
  // const link = 'https://turneazy.com/resetpassword/${token}' + token;  
  // const link = 'https://turneazy.com/resetpassword/${token}';
  const link = `http://localhost:4200/resetpassword/${token}`;
  await User.findOneAndUpdate({ email: email }, {
  resetPasswordLink: link,
  // $push: { resetPasswordLinks: link },
  isResetPasswordLinkUsed: false,
});
  console.log(link);
  var mailResponse = await mailer.mail(
    email,
    "Reset password link for HRMaven ",
    `${link}  Link valid for only 5min `
  );
  console.log(mailResponse);
  res.send({
    message: "email sent",
    token: token
  });

  }
