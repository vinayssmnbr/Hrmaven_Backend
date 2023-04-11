const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    empId: { type: String, required: true },
    name: { type: String, required: true },
    punch_in: { type: String, required: true },
    punch_out: { type: String, required: true },
    status: { type: String, required: true },
    date: { type: Date, required: true },
});

module.exports = mongoose.model('Attendance', attendanceSchema);