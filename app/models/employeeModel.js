const mongoose = require('mongoose')
const Schema = mongoose.Schema
const employeeSchema = new Schema({

    employeeId: {
        type: Number,
        required: true,
        unique: true

    },

    name: {
        type: String,
        required: true
    },

    designation: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    contact: {
        type: Number,
        required: true,
        unique: true
    },
    accountno: {
        type: Number,
        required: true
    },
    address: {
        type: "string",
        required: true
    },
    adhaarno: {
        type: Number,
        required: true
    },
    bankname: {
        type: "string",
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    dateOfJoining: {
        type: Date,
        required: true
    },

    gender: {
        type: "string",
        "enum": ["male", "female"],
        required: true
    },
    ifsc: {
        type: "string",
        "required": true
    },
    mobile: {
        type: Number,
        required: true
    },

    panno: {
        type: Number,
        required: true
    },

})

//MODEL
const EmployeeModel = mongoose.model('employee', employeeSchema)
module.exports = EmployeeModel