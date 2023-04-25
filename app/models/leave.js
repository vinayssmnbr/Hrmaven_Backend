const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({

    empId: {
        type: mongoose.Schema.ObjectId,
        ref: 'employees'
    },
    appliedOn:
    {
        type:Date
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
    },
    category :{
        type:String,
        default:"casual"
    },
    duration:{
        type:Number,
    }



})

module.exports = mongoose.model("employeeleaves", leaveSchema)