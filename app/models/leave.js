const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({

    company:{
        type:mongoose.Schema.ObjectId,
        ref:'hrUser',
        index: true,
    },
    empId: {
        type: mongoose.Schema.ObjectId,
        ref: 'employees',
        index: true,
    },
    appliedOn:
    {
        type:Date,
        default:""
    },
    from: {
        type: Date,
        default:"",
        index: true,
    },
    to: {
        type: Date,
        default:"",
        index: true,
    },
    reason: {
        type: String,
        default:""
    },
    status: {
        type: String,
        enum: ["accept", "reject", "pending"],
        default: "pending",
        index: true,
    },
    category :{
        type:String,
        enum:["Casual Leave","Medical Leave","Compensatory Leave"],
        default:"Casual Leave",
        index: true,
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
    },
    type:{
        type:String,
        default:""
    }



})

module.exports = mongoose.model("employeeleaves", leaveSchema)