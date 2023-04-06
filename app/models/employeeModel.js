const mongoose=require('mongoose')
const Schema=mongoose.Schema
const employeeSchema=new Schema({
    
    employeeId:{
        type:Number,
        required:true,
        unique:true
        
    },

    name:{
        type:String,
        required:true
    },

    designation:{
        type:String,
        required:true   
    },

    email:{
          type:String,
          required:true,
          unique:true
    },

    contact:{
        type:Number,
        required:true,
        unique:true
    },
})

//MODEL
const EmployeeModel= mongoose.model('employee',employeeSchema)
module.exports=EmployeeModel


