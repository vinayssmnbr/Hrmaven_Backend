const EmployeeModel = require("../models/employee/employeeModel");

const deleteEmployee = (id) => {
  return new Promise((resolve, reject) => {
    EmployeeModel.findOneAndUpdate({_id:id},
      { status: "deleted" })
      .then((data) => {
        if (!data) {
          reject(`Cannot Delete with id ${id}. Maybe id is wrong`);
        } else {
          resolve("User was deleted successfully!");
        }
      })
      .catch((err) => {
        console.log(err)
        reject("Could not delete User with id=" + id);
      });
  });
};

module.exports = {
  deleteEmployee,
};
 