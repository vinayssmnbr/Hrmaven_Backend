const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    googleID: {
      type: String,
    },
    username: {
        type: String,
        required: false,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim:true,
    },
    password: {
      type: String,
      minlength: 8,
    },
    confirm: {
      type: String,
    },
  resetPasswordLink: {
    type: String,
  },
  isResetPasswordLinkUsed: {
    type: Boolean,
    default: false,
  },
  },
  { timestamps: true }
);

const User = mongoose.model("hrUser", userSchema);
module.exports = User;
