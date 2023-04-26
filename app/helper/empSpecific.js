const  User = require('./user.model');
const EmployeeSpecificModel = require("../models/specifieEmployeeDetails");


 //update profile
 exports.updateUser = async (id, update)=>{
    const user = await User.findByIdAndUpdate(id,update,{new:true});
    
    return user;
   }

   //update comapny profile

   exports.updateCompany = async(id,update)=>{
    const company = await User.findByIdAndUpdate(id,update,{new:true});

    return company;
   }
  
