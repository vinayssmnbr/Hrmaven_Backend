const EmployeeModel = require("../models/employee/employeeModel");
var ObjectId = require('mongodb').ObjectId;
const Attendance = require('../models/attendance');


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
                    compensatory: "$balance.compensatory",
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

const leavedonut = async(req,res)=>{
  let id= req.headers.id;
  const data = await Attendance.aggregate([
    {
      $match: {
        empId: new ObjectId(id),
      },
    },
    {
      $group: {
        _id: {
          $month: "$date",
        },
        attendance: {
          $push: {
            status: "$status",
          },
        },
      },
    },
    {
      $addFields: {
        total: {
          $size: "$attendance",
        },
        leave: {
          $size: {
            $filter: {
              input: "$attendance",
              as: "item",
              cond: {
                $eq: ["$$item.status", "leave"],
              },
            },
          },
        },
        absent: {
          $size: {
            $filter: {
              input: "$attendance",
              as: "item",
              cond: {
                $eq: ["$$item.status", "absent"],
              },
            },
          },
        },
        present: {
          $size: {
            $filter: {
              input: "$attendance",
              as: "item",
              cond: {
                $eq: ["$$item.status", "present"],
              },
            },
          },
        },
      },
    },
    {
      $project: {
        month: "$_id",
        _id: 0,
        total: 1,
        present: 1,
        absent: 1,
        leave: 1,
      },
    },
    {
      $sort:
        {
          month: 1,
        },
    },
  ])

  res.json(data);
}

module.exports = {
    leaveBalanceChart,
    leaveHistory,
    leavedonut,

};
