const EmployeeModel = require("../models/employee/employeeModel");

const findemailhelper = {};

findemailhelper.getCredentialsByEmail = async function (mobile) {
  try {
    const user = await EmployeeModel.findOne({ mobile: mobile });
    return user;
  } catch (error) {
    console.log("Error in retrieving user by mobile:", error);
    throw error;
  }
};

module.exports = findemailhelper;
