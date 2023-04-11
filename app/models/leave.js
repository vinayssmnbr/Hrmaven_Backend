const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  
    employeeId:{
        type:String
    },
    employeeName:{
        type:String
    },
   from:{
    type:Date
   },

   to:{
    type:Date
   },
   reason:{
    type:String
   },
   status:{
    type:String,
    enum:["accept","reject"],
    default:"pending",
   }


})

module.exports = mongoose.model("leave4",leaveSchema)