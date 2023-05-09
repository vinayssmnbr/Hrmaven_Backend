const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({

    company:{
        type:mongoose.Schema.ObjectId,
        ref:'hrUser'
    },
    empId: {
        type: mongoose.Schema.ObjectId,
        ref: 'employees'
    },
    appliedOn:
    {
        type:Date,
        default:""
    },
    from: {
        type: Date,
        default:""
    },
    to: {
        type: Date,
        default:""
    },
    reason: {
        type: String,
        default:""
    },
    status: {
        type: String,
        enum: ["accept", "reject", "pending"],
        default: "pending",
    },
    category :{
        type:String,
        enum:["casual","medical","short","compensatory","half 1","half 2"],
        default:"casual"
    },
    duration:{
        type:String,
        default:0
    },
    message:{
        type:String,
        default:""
    },
    document:{
        type:String,
        default:""
    }



})

module.exports = mongoose.model("employeeleaves", leaveSchema)