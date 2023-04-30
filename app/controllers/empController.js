const EmployeeModel = require("../models/employee/employeeModel");
const { getAllEmployees } = require("../helper/employeeHelper");
const employeeService = require("../services/employeeService");
const { Parser } = require('json2csv');
const sendMail = require("../../config/mail");
const jwt = require("jsonwebtoken");
const { User } = require("../models/credential");
const Balance = require("../models/leavebalance");

//Add employee
//http://localhost:8000/api/create
const createEmp = async (req, res) => {
  console.log("inside")
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
  } = req.body;
  const professionalemail = `${name.replace(/\s+/g, "")}.${uid}@hrmaven.com`;
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
        job_type &&
        location &&
        url)
    ) {
      let password = "Hrmaven@123";
      bcrypt.hash(password, 10, function (err, hashedPass) {
        if (err) {
          res.json({ error: err });
        } else {
          password = hashedPass;
        }
      })
      try {
        const newuser = new EmployeeModel({
          ...req.body,
          professionalemail,
        });
        const dd = await newuser.save();
        const balance = new Balance({
          empId: dd._id
        })
        balance.save();

        const user = new User({
          email: professionalemail,
          // status: req.body.status,
          empId:dd._id
        });
        user.save()

        await user.save();

        const payload = {
          email: professionalemail,
          // set the expiry time to 5 minute from now
          exp: Math.floor(Date.now() / 1000) + 5 * 60,
        };
        const secret = process.env.JWT_TOKEN_KEY;
        const token = jwt.sign(payload, secret);
        console.log("t:  ", token);
        // const link = 'https://turneazy.com/resetpassword/${token}' + token;
        // const link = 'https://turneazy.com/resetpassword/${token}';
        const link = `http://localhost:4200/resetpassword/${token}`;

        const to = Array.isArray(req.body.email)
          ? req.body.email.join(",")
          : req.body.email;
        const subject = "Your data submitted";
        const text = `this is a professional email for hrmaven: username:${professionalemail},\r\n Reset Password:${link}`;
        await sendMail.mail(to, subject, text);
        const saved_user = await EmployeeModel.findOne({ email: email });

        res.send({ status: "Success", message: "Added Successfully" });
      } catch (error) {
        console.log(error, 'error');
        res.send({ status: "failed", message: "unable to Added", error });
      }
    } else {
      res.send({ status: "failed", message: "All fields are required" });
    }
  }
};

// GET  ALL Employee
// const getEmp = async (req, res) => {
//   let { search, designation, uid } = req.query;
//   designation = designation != "" ? designation?.split(",") : false;
//   let query = { designation: designation ? designation : { $regex: "" } };
//   try {
//     if (uid?.length) {
//       query["uid"] = uid;
//     }
//     const employees = await getAllEmployees(query);
//     res.json(employees);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

const getEmp = async (req, res) => {
  let { search, status, uid } = req.query;
  status = status != "" ? status?.split(",") : false;
  let query = { status: status ? status : { $regex: "" } };
  try {
    if (uid?.length) {
      query["uid"] = uid;
    }
    const employees = await getAllEmployees(query);
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

// const update = (req, res) => {
//   if (!req.body) {
//     return res.status(400).send({ message: "Data to update can not be empty" });
//   }

//   const id = req.params.id;
//   EmployeeModel.findByIdAndUpdate(id, {
//     $set: {
//       name: req.body.name,
//       age: req.body.age,
//       // add more fields to update here
//       experiences: req.body.experiences // add the experiences array to update
//     }
//   }, { new: true })
//     .then((data) => {
//       if (!data) {
//         res.status(404).send({
//           message: `Cannot Update user with ${id}. Maybe user not found!`,
//         });
//       } else {
//         res.send(data);
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send({ message: "Error Update user information" });
//     });
// };


//Delete a user with with specified user id in the request
//delete
// http://localhost:8000/api/:id

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

const employeedetail = async (req, res) => {
  const email = req.headers.email;
  const data = await EmployeeModel.aggregate([
    {
      $match: {
        professionalemail:
          email,
      },
    },
  ])
  res.json({response:data});
}
module.exports = {
  createEmp,
  deleteEmployee,
  update,
  getEmp,
  getsEmp,
  generateUid,
  employeedetail
};
