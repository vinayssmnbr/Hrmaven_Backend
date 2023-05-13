const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExperienceSchema = new Schema({
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
  },
});

const EducationSchema = new Schema({
  college: {
    type: String,
  },
  stream: {
    type: String,
  },
  passing: {
    type: Number,
  },
  cgpa: {
    type: Number,
  },
});

const employeeSchema = new Schema({
  company: {
    type: mongoose.Schema.ObjectId,
    ref: "hrUser",
    index: true,
  },
  uid: {
    type: Number,
    // index: true,
    // required: true,
  },

  name: {
    type: String,
    // required: true,
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
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  professionalemail: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  password: {
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
    enum: ["Full-Time", "Part-Time", "Internship"],
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
  otherbankname: {
    type: String,
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
  jobdesignation: {
    type: String,
  },
  joiningdate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["active", "terminated", "resigned", "absconder"],
    default: "active",
  },
  Role: {
    type: String,
  },

  experienceItems: [ExperienceSchema],
  educationItems: [EducationSchema],
});

employeeSchema.index({ name: "text" });
const EmployeeModel = mongoose.model("employees", employeeSchema);
module.exports = EmployeeModel;
