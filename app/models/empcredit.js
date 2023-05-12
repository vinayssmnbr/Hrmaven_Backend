const mongoose = require("mongoose");
const empcredit = new mongoose.Schema
({
    
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    isEmpResetPasswordLinkUsed: {
      type: Boolean,
      default: false,
    },  
    password: {
      type: String,
      minlength: 8,
    },
    professional: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
      },
      resetPasswordLink:{
        type: String
      }

});
module.exports = mongoose.model("emp_credit", empcredit)