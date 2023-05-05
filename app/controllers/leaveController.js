const Leave = require("../models/leave")
const EmployeeModel = require("../models/employee/employeeModel");
const mongoose = require("mongoose");
const { setDefaultResultOrder } = require("dns/promises");
// to get all employee leave
var ObjectId = require('mongodb').ObjectId;
var balance = require('../models/leavebalance');

const leave_all = async (req, res) => {

  try {
    const employee_leave = await Leave.find();
    res.send(employee_leave);
  } catch (error) {
    res.json({ message: error })
  }

};

//single employee

const leave_details = async (req, res) => {

  try {
    const single_employee = await Leave.findById(req.params.employeeId);
    res.json(single_employee);
  } catch (error) {
    res.json({ message: error })
  }


};

const updateStatus = async (req, res) => {
  let id = req.params.id;
  try {
    await Leave.findByIdAndUpdate(id, req.body);
    res.send({ msg: "Leave updated", id })
  } catch (err) {
    res.send({ err })
  }
}




//Add leave data

const leave_create = async (req, res) => {
  console.log("yeah");
  console.log(req.body);
  console.log(req.headers);

  const leave_var = new Leave({
    empId: req.body.id,
    appliedOn: req.body.appliedon,
    from: req.body.from,
    to: req.body.to,
    reason: req.body.reason,
    status: "pending",
    category: req.body.category,
    duration: req.body.duration,
    document: req.body.url,
  });
  try {
    // res.send("created")
    const saveLeave = await leave_var.save();
    res.send({ saveLeave: "yeah" })
  } catch (error) {
    console.log(error)
    res.status(400).send(error);
  }
}

const pendingsFetch = async (req, res) => {
  console.log("pending");
}

const leavegraph = async (req, res) => {
  const hrid = req.headers.hrid;
  const graphcontent = await EmployeeModel.aggregate(
    [
      {
        $match: {
          company: new ObjectId(
            hrid
          ),
        },
      },
      {
        $lookup: {
          from: "employeeleaves",
          localField: "_id",
          foreignField: "empId",
          as: "result",
        },
      },
      {
        $unwind: "$result",
      },
      {
        $group: {
          _id: "$result.status",
          attendance: {
            $push: {
              status: "$result.status",
            },
          },
        },
      },
      {
        $addFields: {
          count: {
            $size: "$attendance",
          },
        },
      },
    ]
  );
  res.json({graph:graphcontent});

}


const leavecontent = async (req, res) => {
  const hrid = req.headers.hrid;

  var date = new Date();
  // Get year, month, and day part from the date
  var year = date.toLocaleString("default", { year: "numeric" });
  var month = date.toLocaleString("default", { month: "2-digit" });
  var day = date.toLocaleString("default", { day: "2-digit" });

  // Generate yyyy-mm-dd date string
  var today = year + "-" + month + "-" + day
  console.log(today);


  const data = await EmployeeModel.aggregate([
    {
      $match: {
        company: new ObjectId(
          hrid
        ),
        status: "active",
      },
    },
    {
      $lookup: {
        from: "employeeleaves",
        localField: "_id",
        foreignField: "empId",
        as: "result",
      },
    },
    {
      $unwind: "$result",
    },
    {
      $group: {
        _id: "$result.status",
        leave: {
          $push: {
            uid: "$uid",
            name: "$name",
            empId: "$_id",
            status: "$result.status",
            appliedOn: "$result.appliedOn",
            from: "$result.from",
            to: "$result.to",
            reason: "$result.reason",
            category: "$result.category",
            _id: "$result._id",
            message: "$result.message",
            select: false,
          },
        },
      },
    },
    {
      $addFields: {
        pending: {
          $filter: {
            input: "$leave",
            as: "item",
            cond: {
              $and: [
                {
                  $eq: ["$$item.status", "pending"],
                },
                {
                  $gte: [
                    "$$item.from",
                    new Date("2023-04-01"),
                  ],
                },
              ],
            },
          },
        },
      },
    },
  ]);
  res.send(data);
}


const leaveupdatestatus = async (req, res) => {
  try {

    const doc = await Leave.findById(req.headers.id);
    console.log(doc);
    doc.status = req.headers.status;
    doc.message = req.headers.message;
    doc.save();
    res.json({ reponse: 'update' });
  }
  catch (e) {
    res.send(e);
  }
}

const leavefilter = async (req, res) => {
  let from = "";
  let to = "";
  let category = [];
  console.log(req.headers);
  if (req.headers.from == '') {
    from = "2023-01-01";
  } else {
    from = req.headers.from;
  }

  if (req.headers.to == '') {
    to = "2023-12-31";
  } else {
    to = req.headers.to;
  }
  if (req.headers.category == 'all') {
    category.push("casual");
    category.push("medical");
    category.push("urgent");
    category.push("earned");
  }
  else {
    category.push(req.headers.category);
  }


  const data = await Leave.aggregate([
    {
      $match: {
        from: {
          $gte: new Date(from),
        },
        to: {
          $lte: new Date(to),
        },
        category: {
          $in: category,
        },
      },
    },
    {
      $lookup: {
        from: "employees",
        localField: "empId",
        foreignField: "_id",
        as: "result",
      },
    },
    {
      $unwind: "$result",
    },
    {
      $group: {
        _id: "$status",
        leave: {
          $push: {
            status: "$status",
            appliedOn: "$appliedOn",
            from: "$from",
            to: "$to",
            reason: "$reason",
            category: "$category",
            _id: "$_id",
            message: "$message",
            uid: "$result.uid",
            name: "$result.name",
            select: false,
          },
        },
      },
    },
    {
      $addFields: {
        pending: {
          $filter: {
            input: "$leave",
            as: "item",
            cond: {
              $and: [
                {
                  $eq: ["$$item.status", "pending"],
                },
                {
                  $gte: [
                    "$$item.from",
                    new Date("2023-04-01"),
                  ],
                },
              ],
            },
          },
        },
      },
    },
  ])

  res.json({ result: data });

}


module.exports = {
  leave_all,
  leave_create,
  leave_details,
  updateStatus,
  pendingsFetch,
  leavegraph,
  leavecontent,
  leaveupdatestatus,
  leavefilter,
 

}