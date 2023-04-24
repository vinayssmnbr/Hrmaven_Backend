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
  city: {
    type: String,
  },
  postalCode: {
    type: Number,
  },
  state: {
    type: String,
  },
  mobile: {
    type: Number,
  },
  address: {
    type: String,
  },
  email: {
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
  inter: {
    type: String,
  },
  interPercent: {
    type: Number,
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
  expcompany: {
    type: String,
  },
  expduration: {
    type: String,
  },
  explocation: {
    type: String,
  },
  expcompany1: {
    type: String,
  },
  expduration1: {
    type: String,
  },
  explocation1: {
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
  expdesignation1: {
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
  joblocation1: {
    type: String,
  },
  jobtiming: {
    type: String,
    enum: [
      "9:00 am to 5:00 pm",
      "9:00 am to 6:00pm",
      "10:00 am to 5:00pm",
      "10:00 am to 6:00pm",
    ],
  },
  jobctc: {
    type: String,
  },
  jobempstatus: {
    type: String,
    enum: ["Full-Time Permanent", "Part-Time Employement", "Internship"],
  },
  joiningdate: {
    type: Date,
  },
  status:{
    type:String,
    enum:['deleted','accepted'],
    default:'accepted'
  }
});

employeeSchema.index({ name: "text" });
const EmployeeModel = mongoose.model("employees", employeeSchema);
module.exports = EmployeeModel;
