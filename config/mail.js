var nodemailer = require('nodemailer');

exports.mail = async function (target,subjectMail,message)
{
  console.log("mail reached");
  const expiryTime = new Date(Date.now() + 2 * 60 * 1000); 
    var transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: 'harpreet.singh@venturepact.com',
          pass: 'qrmnytnhmnphvkdo'
        }
      });

       // Generate a token with expiration time of 1 hour
      // var token = jwt.sign({ email: target }, process.env.JWT_TOKEN_KEY, { expiresIn: '1h' });

    // Add token to the password reset link in the message
    // var resetLink = 'http://yourwebsite.com/reset-password?token=' + token;
  
      var mailOptions = {
        from: 'harpreet.singh@venturepact.com',
        to: target,
        subject: subjectMail,
        text: message
      };
  
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          return "error";
        } else {
          return "sent";
        }
      });
  
  
}