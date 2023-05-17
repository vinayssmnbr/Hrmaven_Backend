const jwt = require("jsonwebtoken");
const { User } = require("../models/credential");
const help = require("../helper/helper");
const mailer = require("../../config/mail");
const Empcreditional = require("../models/empcredit");

exports.verify = async function (req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).send("Access Denied !");

  try {
    const UserID = await jwt.verify(token, process.env.JWT_TOKEN_KEY);

    if (!UserID) {
      return res.send("tst");
    }
    req.user = UserID;
    next();
  } catch (error) {
    res.status(400).send("Invalid token !");
  }
};

exports.tokenParser = async function (req, res, next) {
  var email;
  var validate = await help.verify_email(req.body.email);

  if (validate.length == 0) {
    res.send("error in the email");
  } else {
    email = validate[0].email;
  }

  const payload = {
    email: email,
    // set the expiry time to 5 minute from now
    exp: Math.floor(Date.now() / 1000) + 5 * 60,
  };
  const secret = process.env.JWT_TOKEN_KEY;
  const token = jwt.sign(payload, secret);

  // const link = 'https://turneazy.com/resetpassword/' + token;
  const link = `https://turneazy.com/resetpassword/${token}`;
  // const link = `http://localhost:4200/resetpassword/${token}`;
  await User.findOneAndUpdate(
    { email: email },
    {
      resetPasswordLink: link,
      // $push: { resetPasswordLinks: link },
      isResetPasswordLinkUsed: false,
    }
  );
  const text = `<head>

  <!--[if gte mso 9]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->

  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--<![endif]-->

  <!-- Your title goes here -->
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

              <p style="font-size: 14px; line-height: 100%; font-family: 'Neuton' font-weight: 400; text-decoration: none; color: #444444;">Dear ${email} ,</p>
                                                                                                                                             <p style="font-size: 14px; line-height: 100%; font-family: 'Neuton'  font-weight: 400; text-decoration: none; color: #444444;"> Kindly copy the following link into your browser :</p>
<a href="${link}" style="text-decoration:none; "><p style="font-size: 14px;  font-family: 'Neuton'  font-weight: 400; margin-top:-10px; text-decoration: none; color:#5A8DFF">${link}</p></a>

 <p style="font-size: 14px; line-height: 100%; font-family: 'Neuton' font-weight: 400; text-decoration: none;  color: #444444;">If it’s not you, you can safely ignore this message.</p>

              <p style="font-size: 14px; line-height: 100%; font-family: 'Neuton' font-weight: 400; text-decoration: none; margin-top: 20px; color: #444444;">Best regards,</p>

              <p style="font-size: 14px; line-height: 100%; font-family: 'Neuton'; font-weight: 400; margin-top: -10px;  text-decoration: none; color: #444444;"> Team <br>HRMaven</p>
              
              <!--               <p style="font-size: 15px; line-height: 24px; font-family: 'Helvetica', Arial, sans-serif; font-weight: 400; text-decoration: none; color: #919293;">You can download this template <a target="_blank" style="text-decoration: underline; color: #000000;" href="https://fullsphere.co.uk/misc/free-template/html-email-template.zip" download="HTML Email Template"><u>here</u></a></p> -->

            </td>
          </tr>
        </tbody>
      </table>
  </div>
</body>`;
  var mailResponse = await mailer.mail(
    email,
    "Reset password for HRMaven ",
    text
  );

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
  const link = `https://turneazy.com/resetpasswordemp/${token}`;
  // const link = `http://localhost:4200/resetpasswordemp/${token}`;
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
