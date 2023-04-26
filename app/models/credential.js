// const mongoose = require("mongoose");

// const Schema = mongoose.Schema;

// const userSchema = new Schema(
//   {
//     googleID: {
//       type: String,
//     },
//     username: {
//         type: String,
//         required: false,
//         trim: true,
//         lowercase: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         lowercase: true,
//         trim:true,
//     },
//     password: {
//       type: String,
//       minlength: 8,
//     },
//     confirm: {
//       type: String,
//     },
//   resetPasswordLink: {
//     type: String,
//   },
//   isResetPasswordLinkUsed: {
//     type: Boolean,
//     default: false,
//   },
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("hrUser", userSchema);
// module.exports = User;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const companySchema = new Schema(
//   {
//     name: {
//       type: String,
//       required: true
//     },
//     phone: {
//       type: String,
//       required: true
//     },
//     noOfEmployee: {
//       type: Number,
//       enum: ["0-50", "50-100", "100-150"],
//       default: "0-50",
//       required: true,
//     },
//     headOffice: {
//       type: String,
//       enum: ["Leeds United-Kingdom", "London United-Kingdom", "Manchester United-Kingdom"],
//       default: "Leeds United-Kingdom",
//       required: true,
//     },
//     description: {
//       type: String,
//     }

//   }
//   // { timestamps: true }
// );

const userSchema = new Schema(
  {
    googleID: {
      type: String,
    },
    username: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },
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
    // company: companySchema,
    isFromSignupPage: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// const Company = mongoose.model("Company", companySchema);
const User = mongoose.model("hrUser", userSchema);

// module.exports = {Company, User };
module.exports =  User ;
