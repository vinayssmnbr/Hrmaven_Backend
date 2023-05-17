const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const recruiterSchema = new Schema({
  jobId: {
    type: mongoose.Schema.ObjectId,
    ref: "jobvacancies",
  },
  empId: {
    type: mongoose.Schema.ObjectId,
    ref: "employees",
  },
  email: {
    type: String,
  },
  name: {
    type: String,
  },
  url: {
    type: String,
  },
});

const recruiterModal = mongoose.model("recruiter", recruiterSchema);
module.exports = recruiterModal;
