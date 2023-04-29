// const mongoose = require("mongoose");

// const Schema = mongoose.Schema;

// const companySchema = new Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   phone: {
//     type: Number,
//     required: true
//   },
//   noOfEmployee: {
//     type: String,
//     enum: ["0-50", "50-100", "100-150"],
//     default: "0-50",
//     required: true,
//   },
//   headOffice: {
//     type: String,
//     enum: ["Leeds United-Kingdom", "London United-Kingdom", "Manchester United-Kingdom"],
//     default: "Leeds United-Kingdom",
//     required: true,
//   },
//   description: {
//     type: String,
//   }
// });

// const hrUserSchema = new Schema(
//   {
//     googleID: {
//       type: String,
//     },
//     username: {
//       type: String,
//       required: false,
//       trim: true,
//       lowercase: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       minlength: 8,
//     },
//     confirm: {
//       type: String,
//     },
//     resetPasswordLink: {
//       type: String,
//     },
//     isResetPasswordLinkUsed: {
//       type: Boolean,
//       default: false,
//     },
//     company: companySchema,
//     isFromSignupPage: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// const hrUser = mongoose.model("hrUser", hrUserSchema);

// module.exports = hrUser;
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const companySchema = new Schema({
  name: {
    type: String
    },
  phone: {
    type: Number
  },
  noOfEmployee: {
    type: String,
    enum: ["0-50", "50-100", "100-150", "150-200", "200-250","250-300","300-350"],
    default: "0-50"
  },
  headOffice: {
    type: String
    // enum: ["Leeds United-Kingdom", "London United-Kingdom", "Manchester United-Kingdom"],
    // default: "Leeds United-Kingdom",
  },
  description: {
    type: String,
  }
});

const userSchema = new Schema({
  empId: {
    type: mongoose.Schema.ObjectId,
    ref: 'employees'
},
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
  personaldata: companySchema,
  // company: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Company',
  // },
  isFromSignupPage: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const User = mongoose.model('hrUser', userSchema);
// const Company = mongoose.model('personaldata', companySchema);

module.exports = {
  User,
  // Company,
};
