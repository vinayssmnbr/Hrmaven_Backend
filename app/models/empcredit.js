const mongoose = require("mongoose");
const empcredit = new mongoose.Schema
({
    
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
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
      },

});
module.exports = mongoose.model("emp_credit", empcredit)