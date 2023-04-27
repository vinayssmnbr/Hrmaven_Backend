const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({

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
        enum:["casual","medical","urgent","earned"],
        default:"casual"
    },
    duration:{
        type:Number,
        default:0
    },
    message:{
        type:String,
        default:""
    },
    document:{
        type:String,
        default:"https://vein.stonybrookmedicine.edu/sites/default/files/Adult_Patient_Demographic_Form.pdf"
    }



})

module.exports = mongoose.model("employeeleaves", leaveSchema)