const mongoose = require("mongoose");
const InvitemeetingSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  professionalemail: {
    type: String,
  },
  designation: {
    type: String,
  },
});
const meetingSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.ObjectId,
    ref: "candidates",
  },
  description: {
    type: String,
  },
  meeting_title: {
    type: String,
  },
  mode: {
    type: String,
  },
  date: {
    type: String,
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
  list: [InvitemeetingSchema],
});

const Meeting = mongoose.model("meeting", meetingSchema);

module.exports = Meeting;
