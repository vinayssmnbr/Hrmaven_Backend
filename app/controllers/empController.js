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
const bcrypt = require("bcryptjs");
const Empcreditional = require("../models/empcredit");
const Attendance = require('../models/attendance');

const createEmp = async (req, res) => {
  console.log("inside");
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
    experienceDetails,
  } = req.body;
  console.log(req.body);
  const professionalemail = `${name
    .replace(/\s+/g, "")
    .toLowerCase()}.${uid}@hrmaven.com`;
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
        job_type 
      )
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
              email: email,
              // set the expiry time to 5 minute from now
              exp: Math.floor(Date.now() / 1000) + 5 * 60,
            };
            const secret = process.env.JWT_TOKEN_KEY;
            const token = jwt.sign(payload, secret);
            console.log("t:  ", token);
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
            console.log(link);
            const to = Array.isArray(req.body.email)
              ? req.body.email.join(",")
              : req.body.email;
            const subject = "Your data submitted";
            const text = `this is a professional email for hrmaven: username:${professionalemail},\r\n password:${password},\r\n resetlink:${link}`;
            await sendMail.mail(to, subject, text);
            const saved_user = await EmployeeModel.findOne({ email: email });
            console.log(saved_user);
            newemployeeattendance(saved_user._id);
            res.send({ status: "Success", message: "Added Successfully" });
          } catch (error) {
            console.log(error, "error");
            res.send({ status: "failed", message: "unable to Added", error });
          }
        }
      });
    }else{
      res.status(400).send({msg:"some fields are missing", status:'fail'})
    }
  }
};

const newemployeeattendance = async (id) => {

  const date = new Date();
  let  today = date.getDate();
  today = today + 1;
  let i = 2;
  while (i <= today) {
    var firstDay = new Date(date.getFullYear(), date.getMonth(), i);
    console.log(firstDay);
    if (i < today) {
      const attendance = new Attendance({
        empId: new ObjectId(id),
        date: new Date(firstDay),
        status: "X"
      });
      await attendance.save();
    } else {
      const attendance = new Attendance({
        empId: new ObjectId(id),
        date: new Date(firstDay),
        status: "absent"
      });
      await attendance.save();
    }
    i++;
  }

}
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
        res.send("update success");
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
    let doc = await EmployeeModel.find().sort({ uid: -1 });
    let uid = 22000;
    if (Array.isArray(doc) && doc[0]) {
      uid = +doc[0].uid + 1;
    }
    console.log(uid, "uid");
    res.send({ uid });
  } catch (error) {
    res.send({
      msg: "error",
    });
  }
};

//first file of ExportUsers

const exportUsers = async (req, res) => {
  console.log("inside");
  try {
    let users = [];
    let usersData = req.body.data;

    console.log(req.body);
    console.log("adarsh", usersData);
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
    console.log(user, "roit");
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
//   // console.log("inside")
//   try {
//     let users = [];
//     var userData = await EmployeeModel.find({});
//     // let userData = req.body.userData // this.selectedEmployess
//     //  console.log('user', userData)
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

// first file of importUsers

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
    console.log(req.file.path);
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

        console.log(response);
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

//hs
const dateWiseAttendance = async (req, res) => {
  const mydate = req.headers.mydate;
  const hrid = req.headers.hrid;
  const attendance = await Employee.aggregate([
    {
      $match:
      /**
       * query: The query in MQL.
       */
      {
        company: new ObjectId(hrid),
      },
    },
    {
      $lookup: {
        from: "attendances",
        localField: "_id",
        foreignField: "empId",
        as: "attendances",
      },
    },
    {
      $unwind: "$attendances",
    },
    {
      $project: {
        uid: 1,
        name: 1,
        date: "$attendances.date",
        status: "$attendances.status",
        in: "$attendances.punch_in",
        out: "$attendances.punch_out",
        designation: 1,
      },
    },
    {
      $match: {
        date: {
          $gte: new Date(mydate),
        },
      },
    },
  ]);
  // console.log("date"+attendance);
  res.send(attendance);
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
  dateWiseAttendance,
 
};
