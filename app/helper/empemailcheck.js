const EmployeeModel = require('../models/employee/employeeModel');


const findemailhelper = {};

findemailhelper.getCredentialsByEmail = async function(email) {
    try {
        const user = await EmployeeModel.findOne({email: email});
        return user;
    } catch(error) {
        console.log('Error in retrieving user by email:', error);
        throw error;
    }
}

module.exports = findemailhelper;