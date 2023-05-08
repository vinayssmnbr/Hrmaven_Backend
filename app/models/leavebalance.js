const mongoose = require("mongoose");

const leavebalance = new mongoose.Schema({

    empId: {
        type: mongoose.Schema.ObjectId,
        ref: 'employees'
    },
    casual: {
        type: Number,
        default: 10
    },
    medical: {
        type: Number,
        default: 10
    },
    compensatory: {
        type: Number,
        default: 5
    }
})

module.exports = mongoose.model("leavebalance", leavebalance)