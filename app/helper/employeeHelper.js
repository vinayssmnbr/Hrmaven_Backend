
const EmployeeModel = require('../models/employeeModel');

const getAllEmployees = async () => {
  try {
    const employees = await EmployeeModel.find();
    return employees;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  getAllEmployees
};
