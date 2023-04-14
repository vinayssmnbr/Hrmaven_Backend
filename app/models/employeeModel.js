const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const employeeSchema = new Schema({
  uid: {
    type: Number,
    required:true,
    unique: true,
  },

  name: {
    type: String,
    required:true
  },

  designation: {
    type: String,
    required:true
  },

  email: {
    type: String,
      required:true,
      unique: true,
  },

  mobile: {
    type: Number,
    required:true,
    unique:true
  },

  dateOfJoining: {
    type: Date,
    //    required: true,
    default: Date.now,
  },

  dateOfBirth: {
    type: Date,
    required:true
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "other"],
  },
  address: {
    type: String,
    // required: true,
    trim: true,
  },
  bankname: {
    type: String,
    // required: true,
    trim: true,
  },
  adhaarno: {
    type: String,
    required: true,
    unique: true,
    // validate: {
    //     validator: function(v) {
    //       return /^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$/.test(v);
    //     },
    //     message: props => `${props.value} is not a valid Aadhaar number!`
    //   }
  },
  accountno: {
    type: String,
    // required: true,
    unique: true,
    trim: true,
  },
  ifsc: {
    type: String,
    trim: true,
  },
  panno: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    // validate: {
    //     validator: function(v) {
    //       return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
    //     },
    //     message: props => `${props.value} is not a valid PAN number!`
    //   }
  },
});

//MODEL
employeeSchema.index({ name: "text" });
// employeeSchema.createIndex({ name: "text" });
const EmployeeModel = mongoose.model("employee", employeeSchema);
module.exports = EmployeeModel;
