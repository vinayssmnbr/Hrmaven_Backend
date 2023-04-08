const Leave = require("../models/leave")

// to get all employee leave

const leave_all =  async(req,res) =>{
   
    try{
        const employee_leave = await Leave.find();
        res.json(employee_leave);
    }catch(error){
        res.json({message:error})
    }

};

//single employee

const leave_details = async (req,res) =>{
   
    try{
        const single_employee = await Leave.findById(req.params.employeeId);
        res.json(single_employee); 
    }catch(error){
        res.json({message:error})
    }
    

};

//Add leave data

const leave_create = async(req,res)=>{
  
    const leave_var = new Leave({
        employeeId: req.body.employeeId,
        employeeName: req.body.employeeName,
        // from:Date(req.body.from),
        // to: Date(req.body.to),
         from:req.body.from,
        to: req.body.to,
        reason:req.body.reason,
        status:req.body.status,

    });

    const saveLeave = await leave_var.save();
    console.log(saveLeave)
    try{
        // res.send("created")
        const saveLeave = await leave_var.save();
        res.send(saveLeave)
    }
    catch(error){
        console.log(error)
        res.status(400).send(error);
    }



}

module.exports = {
    leave_all,
    leave_create,
    leave_details

}