const mongoose = require("mongoose");
const leave = require("../models/leave");
const leaveService = require('../services/leaveService');
const leaveHelpers = require('../helper/leaveHelper');
const leave_all = async (req, res) => {
  try {
    const leave_varall = await leaveHelpers.getAllLeaves();
    res.json(leave_varall);
  } catch (error) {
    res.json({ message: error.message });
  }
};
const leave_details = async (req, res) => {
  try {
    const leave_varSingle = await leaveHelpers.getLeaveDetails(req.params.employeeId);
    res.json(leave_varSingle);
  } catch (error) {
    res.json({ message: error.message });
  }
};
const leave_create = async(req,res)=>{
    const leave_var = new leave({
        employeeId : req.body.employeeId,
        employeeName : req.body.employeeName,
        reason: req.body.reason,
        action:req.body.action,
        from : req.body.from,
        to: req.body.to,

    });
    const saveLeave = await leave_var.save();
    console.log(saveLeave)
    try{
        res.send("created")
    }
    catch(error){
        console.log(error)
        res.status(400).send(error);
    }
};
const leave_update = async(req,res)=>{
    try{
        const leave_var = {
          employeeId : req.body.employeeId,
          employeeName : req.body.employeeName,
          reason : req.body.reason,
          action: req.body.action,
          from : req.body.from,
          to : req.body.to
        };

        const updated_leave = await leave.findByIdAndUpdate(
            {
                _id: req.params.employeeId

            },
            leave_var
        );

        res.json(updated_leave);
    }catch(error){
       res.json({message:error});
    }
};

const leave_delete = async (req,res) =>{
   try{
        const removedLeave = await leaveService.deleteLeave(req.params.employeeId);
        res.json(removedLeave)
    }
    catch(error){
        res.json({message:error});
    }
};
module.exports = {
    leave_all,
    leave_create,
    leave_delete,
    leave_details,
    leave_update,
   
}