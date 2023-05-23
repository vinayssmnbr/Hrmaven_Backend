const EmployeeModel = require("../models/employee/employeeModel");
const { getAllEmployees } = require("../helper/employeeHelper");
const employeeService = require("../services/employeeService");
const { Parser } = require("json2csv");
const sendMail = require("../../config/mail");
const jwt = require("jsonwebtoken");
const { User } = require("../models/credential");
const Balance = require("../models/leavebalance");
var ObjectId = require("mongodb").ObjectId;
const employee_emailcheck = require("../helper/empemailcheck");
const employee_mobilecheck = require("../helper/empmobilecheck");
const bcrypt = require("bcrypt");
const Empcreditional = require("../models/empcredit");
const Attendance = require("../models/attendance");
const mongoose = require("mongoose");

// const {empcredit}=require("../models/empcredit")

const createEmp = async (req, res) => {
  const {
    uid,
    name,
    designation,
    email,
    mobile,
    dateOfJoining,
    timing,
    ctc,
    job_type,
    location,
    url,
    hrid,
    domain,
  } = req.body;
  console.log(req.body);
  const domainname = await User.findById(hrid);
  const domainz = domainname.personaldata.domain;
  const professionalemail = `${name
    .replace(/\s+/g, "")
    .toLowerCase()}.${uid}@${domainz}`;
  const user = await EmployeeModel.findOne({ email: email });
  if (user) {
    res.send({
      status: "failed",
      message: "Email already exists in the register",
    });
  } else {
    if (
      (uid,
      name &&
        email &&
        designation &&
        mobile &&
        dateOfJoining &&
        timing &&
        ctc &&
        job_type)
    ) {
      const password = "Hrmaven@123";
      bcrypt.hash(password, 10, async (err, hashedPass) => {
        if (err) {
          res.json({ error: err });
        } else {
          try {
            const newuser = new EmployeeModel({
              ...req.body,
              professionalemail,
              company: new ObjectId(req.body.hrid),
            });
            const dd = await newuser.save();
            const balance = new Balance({
              empId: dd._id,
            });
            balance.save();

            const user = new Empcreditional({
              email: professionalemail,
              professional: professionalemail,
              password: hashedPass,
            });
            user.save();
            const payload = {
              email: professionalemail,
              // set the expiry time to 5 minute from now
              exp: Math.floor(Date.now() / 1000) + 5 * 60,
            };
            const secret = process.env.JWT_TOKEN_KEY;
            const token = jwt.sign(payload, secret);
            const link = `https://turneazy.com/resetpasswordemp/${token}`;
            // const link = `http://localhost:4200/resetpasswordemp/${token}`;
            await User.findOneAndUpdate(
              { email: email },
              {
                resetPasswordLink: link,
                isEmpResetPasswordLinkUsed: false,
              }
            );

            const to = Array.isArray(req.body.email)
              ? req.body.email.join(",")
              : req.body.email;
            const subject = `Welcome to ${domainname.username}`;
            // const text = `this is a professional email for hrmaven: username:${professionalemail},\r\n,\r\n resetlink:${link}`;
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
          
                        <p style="font-size: 14px; line-height: 100%; font-family: 'Neuton', font-weight: 400; text-decoration: none; color: #444444;">Dear ${req.body.name},</p>
          
                        <p style="font-size: 14px; line-height: 100%; font-family: 'Neuton',  font-weight: 400; text-decoration: none; color: #444444;">On behalf of the entire team at HRMaven, I would like to extend you a warm welcome to our organization! We are thrilled to have you join our team and are looking forward to your contributions.</p>
          
                        <p style="font-size: 14px; line-height: 100%; font-family: 'Neuton'; font-weight: 400; text-decoration: none; color: #444444;">As you settle into your new position, please know that we are here to help you at every step of the way. Whether you have questions about your benefits, need assistance with a project, or simply want to connect with your colleagues, our HR team is always here to help.</p>
          
                        <p style="font-size: 14px; line-height: 100%; font-family: 'Neuton',  font-weight: 400; text-decoration: none; color: #444444;">
                          We believe that open communication and transparency are the keys to a successful workplace, and we encourage you to share your ideas, feedback, and suggestions with us. Your input is essential to help us continue to grow and improve as an organization.</p>
          
                        <p style="font-size: 14px; line-height: 100%; font-family: 'Neuton', font-weight: 400; text-decoration: none; color: #2f2c9f;">Kindly use the below given credentials for your login:</p>
          
                        <p style="font-size: 14px; line-height: 100%; font-family: 'Neuton',  font-weight: 400; text-decoration: none; margin-top:-10px; color: #2f2c9f;;">Professional Email: ${professionalemail}</p>
          
          
                        <p style="font-size: 14px; line-height: 100%; font-family: 'Neuton', font-weight: 400; margin-top:40px; text-decoration: none; color: #444444;">The credentials given to you are just default credentials. Kindly reset your password immediately by using the link given below:</p>
          
                        <p style="font-size: 14px; cursor:pointer; line-height: 100%; font-family: 'Neuton' font-weight: 400; text-decoration: none; margin-top: -10px; color: #444444;"><a style="color:#8BAFFF;" href="${link}">Reset Link</a></p>
          
                        <p style="font-size: 14px; line-height: 100%; font-family: 'Neuton' font-weight: 400; text-decoration: none; margin-top: 50px; color: #444444;">Best regards,</p>
          
                        <p style="font-size: 14px; line-height: 100%; font-family: 'Neuton'; font-weight: 400; margin-top: -10px;  text-decoration: none; color: #444444;">${domainname.personaldata.name} HR Manager at HRMaven</p>
          
                        <p style="font-size: 14px; line-height: 100%; font-family: 'Neuton' font-weight: 400; margin-top: -10px; text-decoration: none; color: #444444;">Contact no. +91 9875463210</p>
          
                        <!--               <p style="font-size: 15px; line-height: 24px; font-family: 'Helvetica', Arial, sans-serif; font-weight: 400; text-decoration: none; color: #919293;">You can download this template <a target="_blank" style="text-decoration: underline; color: #000000;" href="https://fullsphere.co.uk/misc/free-template/html-email-template.zip" download="HTML Email Template"><u>here</u></a></p> -->
          
                      </td>
                    <tr >
                      <td style="padding-bottom: 50px">
                        <a href="https://turneazy.com/login" target="_blank" style=" width: 100%; display: flex; justify-content:center; align-items:center; text-decoration:none;">
          
                          <span style="background-color:#2f2c9f; padding: 10px 16px; border-radius: 6px; color: #fff; font-size: 12px; font-weight: 700;">LOGIN NOW</span>
          
                        </a>
                      </td>
                    </tr>
                    </tr>
                  </tbody>
                </table>
            </div>
          </body>`;
            await sendMail.mail(to, subject, text);
            const saved_user = await EmployeeModel.findOne({ email: email });
            newemployeeattendance(saved_user._id, req.body.dateOfJoining);
            console.log(saved_user);
            newemployeeattendance(saved_user._id);
            await User.findByIdAndUpdate(hrid, { $inc: { uid: 1 } });
            await res.send({
              status: "Success",
              message: "Added Successfully",
            });
          } catch (error) {
            console.log(error, "error");
            res.send({ status: "failed", message: "unable to Added", error });
          }
        }
      });
    } else {
      res.status(400).send({ msg: "some fields are missing", status: "fail" });
    }
  }
};

const newemployeeattendance = async (id, join) => {
  const date = new Date(join);
  let today = date.getDate();
  let i = 1;
  while (i <= today) {
    var firstDay = new Date(
      new Date(date.getFullYear(), date.getMonth(), i).setHours(19)
    );

    if (i <= today) {
      const attendance = new Attendance({
        empId: new ObjectId(id),
        date: new Date(firstDay),
        status: "X",
      });
      console.log(firstDay);
      await attendance.save();
    }
    i++;
  }
};
const getEmp = async (req, res) => {
  let { search, status, uid, email } = req.query;
  status = status != "" ? status?.split(",") : false;
  let query = { status: status ? status : { $regex: "" } };
  try {
    if (uid?.length) {
      query["uid"] = uid;
    }
    const employees = await getAllEmployees(query, req.headers.hrid);
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//GET A specific Employee
const getsEmp = async (req, res) => {
  res.json(res.employee);
};

//UPDATE DATA
const update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not be empty" });
  }

  const id = req.params.id;
  // const { experienceDetails } = req.body;
  EmployeeModel.findByIdAndUpdate(id, req.body)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot Update user with ${id}. Maybe user not found!`,
        });
      } else {
        res.send({ message: "update success" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: "Error Update user information" });
    });
};

const deleteEmployee = (req, res) => {
  const id = req.params.id;

  employeeService
    .deleteEmployee(id)
    .then((message) => {
      res.send({ message });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

const generateUid = async (req, res) => {
  try {
    let hrid = req.headers.hrid;
    // let doc = await EmployeeModel.find().sort({ uid: -1 });
    let doc = await User.findById(hrid);
    // if (Array.isArray(doc) && doc[0]) {
    //   uid = +doc[0].uid + 1;
    // }
    var uid = doc.uid;
    res.send({ uid });
  } catch (error) {
    console.log(error);
    res.send({
      msg: "error",
    });
  }
};

//first file of ExportUsers

const exportUsers = async (req, res) => {
  try {
    let users = [];
    let usersData = req.body.data;
    usersData.forEach((employees) => {
      const {
        uid,
        name,
        dateOfJoining,
        mobile,
        address,
        email,
        dateOfBirth,
        gender,
        bankname,
        accountno,
        ifsc,
        adhaarno,
        panno,
        designation,
        bloodGroup,
        city,
      } = employees;
      users.push({
        uid,
        name,
        dateOfJoining,
        mobile,
        address,
        email,
        dateOfBirth,
        gender,
        bankname,
        accountno,
        ifsc,
        adhaarno,
        panno,
        designation,
        bloodGroup,
        city,
      });
    });

    const csvFields = [
      "id",
      "uid",
      "name",
      "dateOfJoining",
      "mobile",
      "address",
      "email",
      "dateOfBirth",
      "gender",
      "bankname",
      "accountno",
      "ifsc",
      "adhaarno",
      "panno",
      "designation",
      "bloodGroup",
      "city",
    ];
    const csvParser = new Parser({ csvFields });
    const csvData = csvParser.parse(users);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attatchement:filename=usersData.csv");
    res.status(200).end(csvData);
  } catch (error) {
    res.send({ status: 400, success: false, msg: error.message });
  }
};

const employeedetail = async (req, res) => {
  let userId = req.headers.id;
  try {
    let user = await EmployeeModel.findById(userId);
    res.json({ response: user });
  } catch (err) {
    res.send({ err });
  }
};
//CHECK EMAIL

const getEmployeeEmail = async (req, res) => {
  const { email } = req.params;
  if (!email || email.trim() === "") {
    res.status(400).json({ message: "Email address is required" });
    return;
  }
  try {
    const employee = await employee_emailcheck.getCredentialsByEmail(email);
    if (employee) {
      res.send({
        message: `user-found`,
        email,
        flag: true,
      });
    } else {
      res.send({
        message: `email-id not found`,
        email,
        flag: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching user mobile" });
  }
};

const getEmployeeMobile = async (req, res) => {
  const { mobile } = req.params;
  if (!mobile || mobile.trim() === "") {
    res.status(400).json({ message: "mobile is required" });
    return;
  }
  try {
    const employee = await employee_mobilecheck.getCredentialsByEmail(mobile);
    if (employee) {
      res.send({
        message: `user-found`,
        mobile,
        flag: true,
      });
    } else {
      res.send({
        message: `mobile not found`,
        mobile,
        flag: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching user mobile" });
  }
};

// const exportUsers = async (req, res) => {
//   console.log("inside")
//   try {
//     let users = [];
//     var userData = await EmployeeModel.find({});
//     let userData = req.body.userData // this.selectedEmployess
//      console.log('user', userData)
//     userData.forEach((employees) => {
//       const {
//         id,
//         uid,
//         name,
//         dateOfJoining,
//         mobile,
//         address,
//         email,
//         dateOfBirth,
//         gender,
//         bankname,
//         accountno,
//         ifsc,
//         adhaarno,
//         panno,
//         designation,
//         bloodGroup,
//         city } = employees;
//       users.push({ id, uid, name, dateOfJoining, mobile, address, email, dateOfBirth, gender, bankname, accountno, ifsc, adhaarno, panno, designation, bloodGroup, city });
//     });
//     const csvFields = ['Id', 'UID', 'Name', 'Email', 'DateOfJoining', 'Mobile', 'Address', 'DateofBirth', 'Gender', 'BankName', 'Accountno', 'Ifsc', 'Adharno', 'Panno', 'Designation', 'BloodGroup', 'City'];
//     const csvParser = new Parser({ csvFields });
//     const csvData = csvParser.parse(users);
//     res.setHeader("Content-Type", "text/csv");
//     res.setHeader("Content-Disposition", "attatchement:filename=usersData.csv");
//     res.status(200).end(csvData);

//   } catch (error) {
//     res.send({ status: 400, success: false, msg: error.message });
//   }
// }

//first file of importUsers

// const importUsers = async (req, res) => {
//   try {
//     const files = req.files;
//     if (Array.isArray(files) && files.length > 0) {
//       res.json(files);
//     } else {
//       throw new Error("File upload unsuccessful");
//     }
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };

// second file for importUser

const importUsers = async (req, res) => {
  try {
    var userData = [];
    csv()
      .fromFile(req.file.path)
      .then(async (response) => {
        for (var x = 0; x < response.length; x++) {
          userData.push({
            name: response[x].Name,
            email: response[x].Email,
            mobile: response[x].Mobile,
          });
        }

        await EmployeeModel.insertMany(userData);

        res.send({ status: 200, success: true, msg: "csv imported" });
      });
  } catch (error) {
    res.send({ status: 400, success: false, msg: error.message });
  }
};

const getEmployees = async (req, res) => {
  try {
    const employees = await EmployeeModel.find({});

    res.send({
      status: 200,
      success: true,
      msg: "Employees data",
      data: employees,
    });
  } catch (error) {
    res.send({ status: 400, success: false, msg: error.message });
  }
};

//create Experience
const experienceArray = async (req, res) => {
  try {
    const { experienceDetails } = req.body;
    const modal = new EmployeeModel({ experienceDetails });
    const savedModal = await modal.save();
    res.json(savedModal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const EmpSideUpdate = async (req, res) => {
  const id = req.params.id;
  const {
    motherName,
    fatherName,
    gender,
    nationality,
    bloodGroup,
    maritalStatus,
    dateOfBirth,
    mobile,
    city,
    state,
    address,
    bankname,
    accountno,
    adhaarno,
    panno,
    ifsc,
    passport,
    postalCode,
  } = req.body;
  try {
    const data = await EmployeeModel.findOneAndUpdate({ _id: id }, req.body);
    if (!data == req.body) {
      res.status(404).send({
        message: `Cannot Update user with ${id}. Maybe user not found!`,
      });
    } else {
      res.send({ message: "update success" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error Update user information" });
  }
};
const resetpassword = async (req, res) => {
  var newpassword = req.body.password;
  var confirmPassword = req.body.confirm;
  var token = req.header("auth-token");
  var hashedPassword;
  var hashedConfirm;

  let email = req.params.email;
  if (email.length != 0) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(newpassword, salt);
    const hashedConfirm = await bcrypt.hash(confirmPassword, salt);
    await Empcreditional.findOneAndUpdate(
      { email: email },
      { password: hashedPassword }
    );
    await Empcreditional.findOneAndUpdate(
      { email: email },
      { confirm: hashedConfirm }
    );
    res.send({ message: "Password Changes Successfully" });
  }
};

const oldpasswordcheck = async (req, res) => {
  employee_emailcheck.getolpassword(req, res);
};

module.exports = {
  createEmp,
  deleteEmployee,
  update,
  getEmp,
  getsEmp,
  generateUid,
  getEmployeeEmail,
  exportUsers,
  importUsers,
  getEmployees,
  employeedetail,
  getEmployeeMobile,
  experienceArray,
  EmpSideUpdate,
  resetpassword,
  oldpasswordcheck,
};
