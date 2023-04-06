const mongoose = require("mongoose");
const leaveSchema = new mongoose.Schema({
    employeeId:{
        type:String
    },
    employeeName:{
        type:String
    },
    reason:{
        type:String
    },
    action:{
        type:String,
        enum:["accept","reject"]
    },
    from:Date,
    to:Date
})
module.exports =  mongoose.model("leave2",leaveSchema)