const mongoose = require("mongoose");
const meetingSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.ObjectId,
    ref: "candidates",
  },
  meeting_title: {
    type: String,
  },
  //   mode: {
  //     type: String,
  //     enum: ["Online", "Offline"],
  //   },
  date: {
    type: Date,
  },
  start_time: {
    type: Date,
  },
  end_time: {
    type: Date,
  },
  invite_employee: {
    type: String,
  },
  meetinglink: {
    type: String,
  },
  venue: {
    type: String,
  },
});

const Meeting = mongoose.model("meeting", meetingSchema);

module.exports = Meeting;
