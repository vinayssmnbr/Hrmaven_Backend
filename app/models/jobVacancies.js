const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const skillSchema = new Schema({
  name: {
    type: String,
  },
});

const recruiterSchema = new Schema({
  name: {
    type: String,
  },
});

const jobVacanciesSchema = new Schema({
  hrId: {
    type: mongoose.Schema.ObjectId,
    ref: "hrUser",
  },
  job_title: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
  },
  status: {
    type: String,
    enum: [],
    default: "",
  },
  location: {
    type: String,
    // enum: ["Jalandhar", "Gurugram", "Chandigarh"],
    default: "",
  },
  experience: {
    type: String,
    // enum: ["0 Experience", "1-2 Years", "2-3 Years"],
    default: "",
  },
  ctc: {
    type: Number,
  },
  job_type: {
    type: String,
    // enum: ["Full Time", "Part Time", "Internship"],
    default: "",
  },
  // skill: {
  //   type: String,
  //   default: "",
  // },
  job_description: {
    type: String,
  },
  list: [skillSchema],
  skills: {
    type: String,
  },
  recruiter: [recruiterSchema],
});

const jobVacanciesModal = mongoose.model("jobvacancies", jobVacanciesSchema);
module.exports = jobVacanciesModal;
