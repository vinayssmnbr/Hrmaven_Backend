const EmployeeModel = require("../models/employee/employeeModel");
const { getAllEmployees } = require("../helper/employeeHelper");
const employeeService = require("../services/employeeService");
const sendMail = require("../../config/mail");
const sendlink=require("../middlewares/authentication")


//Add employee
//http://localhost:8000/api/create

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
      const password='Hrmaven@123'
      try{
        const newuser = new EmployeeModel({
          ...req.body,
          professionalemail,
          password,
        });
        await newuser.save();

        const to = Array.isArray(req.body.email) ? req.body.email.join(',') : req.body.email;
        const subject = "Your data submitted";
        const text =`this is a professional email for hrmaven: username:${professionalemail},\r\n password:${password}`
        await sendMail.mail(to, subject, text);
        const saved_user = await EmployeeModel.findOne({ email: email });

        res.send({ status: "Success", message: "Added Successfully" });
      } catch (error) {
        console.log(error);
        res.send({ status: "failed", message: "unable to Added" });
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
module.exports = {
  createEmp,
  deleteEmployee,
  update,
  getEmp,
  getsEmp,
  generateUid,
};
