const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const companySchema = new Schema({
  name: {
    type: String
    },
  phone: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        const phoneRegex = /^((\+91-?)|0)?[0-9]{10}$/;
        return phoneRegex.test(value);
      },
      message: 'Invalid phone number'
    }
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
  },
  profileimage: {
    type: String,
    default: "https://cdn.filestackcontent.com/5lob9pNSSEG08bQX0eNi"
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
  Role:{
    type:String,
    default:"HR"
  }
}, { timestamps: true });

const User = mongoose.model('credit', userSchema);
// const Company = mongoose.model('personaldata', companySchema);

module.exports = {
  User,
  // Company,
};
