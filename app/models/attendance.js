const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    empId: { type: Number, required: true },
    name: { type: String, required: true },
    date: { type: Date, required: true },
    punch_in: { type: String, required: false },
    punch_out: { type: String, required: false },
    status: { type: String, required: true, enum: ["present", "absent", "leave"] },
});

module.exports = mongoose.model('Attendance', attendanceSchema);
