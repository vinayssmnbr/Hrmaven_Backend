const EmployeeModel = require("../models/employee/employeeModel");
var ObjectId = require('mongodb').ObjectId;


const leaveBalanceChart = async(req,res)=>{
    const id=req.headers.id
    const data = await EmployeeModel.aggregate(
        [
            {
                $match:
                {
                    _id: new ObjectId(id),
                },
            },
            {
                $lookup: {
                    from: "leavebalances",
                    localField: "_id",
                    foreignField: "empId",
                    as: "balance",
                },
            },
            {
                $unwind: "$balance",
            },
            {
                $project: {
                    uid: 1,
                    medical: "$balance.medical",
                    urgent: "$balance.urgent",
                    earned: "$balance.earned",
                    casual: "$balance.casual",
                },
            },

        ])
        res.json({response:data});
};

const leaveHistory = async(req,res)=>{
        const id=req.headers.id;
        const data = await EmployeeModel.aggregate([
            {
              $match: {
                _id: new ObjectId(id),
              },
            },
            {
              $lookup: {
                from: "employeeleaves",
                localField: "_id",
                foreignField: "empId",
                as: "History",
              },
            },
            {
              $project: {
                History: 1,
              },
            },
          ])
          res.json({response:data});

}

module.exports = {
    leaveBalanceChart,
    leaveHistory
};
