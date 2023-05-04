const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    empId: {
        type: mongoose.Schema.ObjectId,
        ref: 'employee'
    },
   
    punch_in: {
        type: Date,
        default: ""
    },
    punch_out: {
        type: Date,
        default: ""
    },
    status: {
        type: String,
        required: true,
        enum: ["present", "absent", "leave",'odd']
    },
    date: {
        type: Date,
        required: true
    },
});

attendanceSchema.pre('save', function(next) {
    if (this.isModified('status')) {
        if (this.status === 'absent' || this.status === 'leave') {
            this.punch_in = null;
            this.punch_out = null;
        } else if (this.status === 'present') {
            if (!this.punch_in) {
                this.punch_in = new Date();
            }
            if (this.isModified('punch_out') && this.punch_out) {
                this.punch_out = new Date(this.punch_out);
            }
        }
    }
    next();
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;