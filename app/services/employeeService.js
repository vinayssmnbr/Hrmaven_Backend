const EmployeeModel = require('../models/employeeModel');

const deleteEmployee = (id) => {
  return new Promise((resolve, reject) => {
    EmployeeModel.findByIdAndDelete(id)
      .then(data => {
        if(!data){
          reject(`Cannot Delete with id ${id}. Maybe id is wrong`);
        } else {
          resolve("User was deleted successfully!");
        }
      })
      .catch(err => {
        reject("Could not delete User with id=" + id);
      });
  });
};

module.exports = {
  deleteEmployee,
};
