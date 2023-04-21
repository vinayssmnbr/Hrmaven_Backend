const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({

    employeeId: {
        type: mongoose.Schema.ObjectId,
        ref: 'employee'
    },
    from: {
        type: Date
    },

    to: {
        type: Date
    },
    reason: {
        type: String
    },
    status: {
        type: String,
        enum: ["accept", "reject", "pending"],
        default: "pending",
    }


})

module.exports = mongoose.model("leave4", leaveSchema)