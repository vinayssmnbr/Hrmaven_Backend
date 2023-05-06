const EmployeeModel = require("../models/employee/employeeModel");
var ObjectId = require('mongodb').ObjectId;


const getAllEmployees = async (q,companyz) => {
  try {
    const employees = await EmployeeModel.find({company: new ObjectId(companyz)});
    return employees;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  getAllEmployees,
};
