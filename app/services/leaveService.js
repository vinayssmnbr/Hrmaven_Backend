const Leave = require('../models/leave');
exports.deleteLeave = async (employeeId) => {
  try {
    const removedLeave = await Leave.findByIdAndDelete(employeeId);
    return removedLeave;
  } catch (error) {
    throw error;
  }
};

