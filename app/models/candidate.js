const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const candidateSchema = new Schema({
  jobId: {
    type: mongoose.Schema.ObjectId,
    ref: "jobvacancies",
  },
  empId: {
    type: mongoose.Schema.ObjectId,
    ref: "employees",
  },

  candidateName: {
    type: String,
  },

  candidate_Id: {
    type: Number,
  },

  contactnumber: {
    type: Number,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },

  applieddate: {
    type: Date,
  },

  url: {
    type: String,
  },

  applieddate: {
    type: Date,
    // required: true,
  },

  url: {
    type: String,
  },
  uid: {
    type: Number,
  },
  status: {
    type: String,
    default: "Resume Received",
    enum: [
      "Resume Received",
      "Shortlisted",
      "Interview",
      "Hired",
      "Rejected",
      "Archive",
    ],
  },
});

const candidateModal = mongoose.model("candidate", candidateSchema);
module.exports = candidateModal;
