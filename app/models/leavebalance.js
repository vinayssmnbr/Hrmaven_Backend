const mongoose = require("mongoose");

const leavebalance = new mongoose.Schema({

    empId: {
        type: mongoose.Schema.ObjectId,
        ref: 'employees'
    },
    casual: {
        type: Number,
        default: 0
    },
    medical: {
        type: Number,
        default: 0
    },
    urgent: {
        type: Number,
        default: 0
    },
    earned: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model("leavebalance", leavebalance)