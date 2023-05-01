const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const employeeSchema = new Schema({
  uid: {
    type: Number,
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },
  dateOfJoining: {
    type: Date,
    default: Date.now,
  },
  mobile: {
    type: Number,
  },
  email: {
    type: String,
  },
  professionalemail:{
    type:String
  },
  password:{
    type:String,
  },
  designation: {
    type: String,
    enum: [
      "Software Developer",
      "Frontend Developer",
      "Full Stack Developer",
      "UI/UX Designer",
      "Quality Analyst",
    ],
  },
  timing: {
    type: String,
    enum: [
      "9.00am to 5:00pm",
      "9.00am to 6:00pm",
      "10.00am to 5:00pm",
      "10.00am to 6:00pm",
    ],
  },
  ctc: {
    type: String,
  },
  job_type: {
    type: String,
    enum: ["Full-Time Permanent", "Part-Time Employement", "Internship"],
  },
  location: {
    type: String,
    enum: ["Mohali", "Gurugram", "Pune", "Hyderabad", "Bangalore"],
  },
  url: {
    type: String,
  },
  city: {
    type: String,
  },
  postalCode: {
    type: Number,
  },
  state: {
    type: String,
  },

  address: {
    type: String,
  },

  fatherName: {
    type: String,
  },
  motherName: {
    type: String,
  },
  maritalStatus: {
    type: String,
    enum: ["Married", "Unmarried"],
  },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
  },
  nationality: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  bankname: {
    type: String,
    enum: [
      "State Bank Of India",
      "Punjab National Bank",
      "Central Bank Of India",
      "HDFC Bank",
      "ICICI Bank",
      "Others",
    ],
  },
  accountno: {
    type: Number,
  },
  ifsc: {
    type: String,
  },
  adhaarno: {
    type: Number,
  },
  panno: {
    type: String,
  },
  passport: {
    type: String,
  },
  matric: {
    type: String,
  },
  matricPercent: {
    type: Number,
  },
  matricpassing:{
    type:Number
  },
  inter: {
    type: String,
  },
  interPercent: {
    type: Number,
  },
  interpassing:{
    type:Number
  },
  graduation: {
    type: String,
  },
  graduationStream: {
    Type: String,
  },
  graduationCgpa: {
    type: Number,
  },
  pg: {
    type: String,
  },
  pgStream: {
    type: String,
  },
  pgCgpa: {
    type: String,
  },

  expcompany: {
    type: String,
  },
  expduration: {
    type: String,
  },
  explocation: {
    type: String,
  },
  expdesignation: {
    type: String,
    enum: [
      "Software Developer",
      "Frontend Developer",
      "Full Stack Developer",
      "UI/UX Designer",
      "Quality Analyst",
    ],
  },
  jobdesignation: {
    type: String,
    enum: [
      "Software Developer",
      "Frontend Developer",
      "Full Stack Developer",
      "UI/UX Designer",
      "Quality Analyst",
    ],
  },
  joiningdate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["active", "terminated", "resigned", "absconder"],
    default: "active",
  },
Role:{
  type:String,

}



   // expcompany1: {
  //   type: String,
  // },
  // expduration1: {
  //   type: String,
  // },
  // explocation1: {
  //   type: String,
  // },

  // expdesignation1: {
  //   type: String,
  //   enum: [
  //     "Software Developer",
  //     "Frontend Developer",
  //     "Full Stack Developer",
  //     "UI/UX Designer",
  //     "Quality Analyst",
  //   ],
  // },
 
  // joblocation1: {
  //   type: String,
  // },
  // experience:[
  //   {
  //     company:{
  //       type:String
  //     },
  //     duration:{
  //       type:String
  //     },
  //     location:{
  //       type:String
  //     },
  //     degination:{
  //         type: String,
  //   enum: [
  //     "Software Developer",
  //     "Frontend Developer",
  //     "Full Stack Developer",
  //     "UI/UX Designer",
  //     "Quality Analyst",
  //   ],
  //     }

  //   }
  // ]
});

employeeSchema.index({ name: "text" });
const EmployeeModel = mongoose.model("employees", employeeSchema);
module.exports = EmployeeModel;
