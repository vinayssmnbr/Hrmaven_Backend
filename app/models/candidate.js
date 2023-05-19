const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const candidateSchema = new Schema({

    jobId: {
        type: mongoose.Schema.ObjectId,
        ref: "jobvacancies",
      },

      candidateName: {
        type: String
    },

    candidate_Id: {
        type: Number,
        // required: true,
    },

    contactnumber: {
        type: Number,
        // required: true,

    },
    email: {
        type: String,
        // unique: true,
        lowercase: true,
        trim: true,
        // index: true
    },

    applieddate: {
        type: Date,
        // required: true,
    },

    url: {
        type: String,

    },

    status: {
        type: String,
        enum: ["resume received", "shortlisted", "interview", "hired", "rejected", "archive"],
        default: "resume received",
    },

})

const candidateModal = mongoose.model("candidate", candidateSchema);
module.exports = candidateModal;
