const mongoose = require("mongoose");
const candcredit = new mongoose.Schema
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
      },
    firstVisit:{
      type:Boolean,
      default:true,
    }

});
module.exports = mongoose.model("cand_credit", candcredit)