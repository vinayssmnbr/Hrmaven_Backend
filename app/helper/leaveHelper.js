const leave = require('../models/leave');
const getAllLeaves = async () => {
  try {
    const leave_varall = await leave.find();
    return leave_varall;
  } catch (error) {
    throw error;
  }
};
const getLeaveDetails = async (employeeId) => {
  try {
    const leave_varSingle = await leave.findById(employeeId);
    return leave_varSingle;
  } catch (error) {
    throw error;
  }
};
module.exports = {
  getAllLeaves,
  getLeaveDetails
};