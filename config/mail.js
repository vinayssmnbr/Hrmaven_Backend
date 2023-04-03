var nodemailer = require('nodemailer');

exports.mail = async function (target,subjectMail,message)
{
  console.log("mail reached");
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