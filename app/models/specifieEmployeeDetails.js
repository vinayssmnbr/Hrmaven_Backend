const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const EmployeeModel = require('../models/employee/employeeModel')

// Define a new schema with required fields
const EmployeeDetailsSchema = new Schema({
  // uid: {
  //   // type: Schema.Types.ObjectId,
  //   // ref: 'employees',
  //   type: Number,
  // required: true
  // },
  // name: {
  //   type: String,
  //   required: true,
  // },
  // mobile: {
  //   type: Number,
  // },
  // dateOfBirth: {
  //   type: Date,
  // },
  // email: {
  //   type: String,
  // },
  noOfEmployee: {
    type: Number,
    enum: ["0-100", "100-200", "200-300"],
    // required: true,
  },
  headoffice: {
    type: String,
    enum: ["Leeds United-Kingdom", "London United-Kingdom", "Manchester United-Kingdom"],
    // required: true,
  },
});

// // Use a projection to fetch only the required fields from EmployeeModel
// EmployeeModel.find({}, { name: 1, mobile: 1, dateOfBirth: 1, email: 1 })
//   .then((employees) => {
//     employees.forEach(function(employee) {
//       const employeeDetails = new EmployeeDetailsModel({
//         uid: employee.uid,
//         name: employee.name,
//         mobile: employee.mobile,
//         dateOfBirth: employee.dateOfBirth,
//         email: employee.email,
//       });
//       employeeDetails.save()
//         .then(() => {
//           console.log('Employee details saved successfully');
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// Define and export the new schema
const EmployeeDetailsModel = mongoose.model(
  "employee_details",
  EmployeeDetailsSchema
);;
module.exports = EmployeeDetailsModel;
