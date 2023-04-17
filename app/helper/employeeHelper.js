const EmployeeModel = require("../models/employee/employeeModel");

const getAllEmployees = async (q) => {
  try {
    console.log(q);
    const employees = await EmployeeModel.find(q);
    return employees;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  getAllEmployees,
};
