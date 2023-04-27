const EmployeeModel = require("../models/employee/employeeModel");
const { getAllEmployees } = require("../helper/employeeHelper");
const employeeService = require("../services/employeeService");
const { Parser } = require('json2csv');
const sendMail = require("../../config/mail");
const sendlink=require("../middlewares/authentication")


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


//first file of ExportUsers

const exportUsers = async (req, res) => {
  console.log("inside")
  try {
    let users = [];
    let usersData = req.body.data
   
    console.log(req.body);
    console.log('adarsh', usersData)
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
        city

      } = employees;
      users.push({  uid, name, dateOfJoining, mobile, address, email, dateOfBirth, gender, bankname, accountno, ifsc, adhaarno, panno, designation, bloodGroup, city });
    });

    const csvFields = ["id", "uid", "name", "dateOfJoining", "mobile", "address", "email", "dateOfBirth", "gender", "bankname", "accountno", "ifsc", "adhaarno", "panno", "designation", "bloodGroup", "city"];
    const csvParser = new Parser({ csvFields });
    const csvData = csvParser.parse(users);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attatchement:filename=usersData.csv");
    res.status(200).end(csvData);

  } catch (error) {
    res.send({ status: 400, success: false, msg: error.message });
  }
}

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
    console.log(req.file.path)
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
        res.send({ status: 200, success: true, msg: 'csv imported' });
      })

  } catch (error) {
    res.send({ status: 400, success: false, msg: error.message });
  }
}



const getEmployees = async (req, res) => {

  try {

    const employees = await EmployeeModel.find({});

    res.send({ status: 200, success: true, msg: 'Employees data', data: employees });

  }
  catch (error) {
    res.send({ status: 400, success: false, msg: error.message });
  }

}




module.exports = {
  createEmp,
  deleteEmployee,
  update,
  getEmp,
  getsEmp,
  generateUid,
  exportUsers,
  importUsers,
  getEmployees
};
