const Leave = require("../models/leave")
const EmployeeModel = require("../models/employee/employeeModel");
const mongoose = require("mongoose");
const { setDefaultResultOrder } = require("dns/promises");
// to get all employee leave
var ObjectId = require('mongodb').ObjectId;
var balance = require('../models/leavebalance');
const leavebalance = require("../models/leavebalance");

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
    res.send({ saveLeave });
  } catch (error) {
    console.log(error)
    res.status(400).send(error);
  }
}

const pendingsFetch = async (req, res) => {

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
  res.json({ graph: graphcontent });

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
      $lookup: {
        from: "leavebalances",
        localField: "_id",
        foreignField: "empId",
        as: "balance",
      },
    },
    {
      $unwind: "$result",
    },
    {
      $unwind: "$balance",
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
            url: "$result.document",
            duration: "$result.duration",
            balance: "$balance",
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
    doc.status = req.headers.status;
    doc.message = req.headers.message;
    var duration = Number(doc.duration);
    console.log(typeof (+doc.duration));
    console.log(typeof (parseInt(doc.duration)));
    doc.save();
    if ((req.headers.status == 'accept') && (doc.category == 'casual')) {
      var data = await leavebalance.findOneAndUpdate({ empId: new ObjectId(doc.empId) }, { $inc: { 'casual': -duration } });
      console.log("update inc");
    }

    else if ((req.headers.status == 'accept') && (doc.category == 'compensatory')) {
      var data = await leavebalance.findOneAndUpdate({ empId: new ObjectId(doc.empId) }, { $inc: { 'compensatory': -duration } });
      console.log("update inc");
    }

    else if ((req.headers.status == 'accept') && (doc.category == 'medical')) {
      var data = await leavebalance.findOneAndUpdate({ empId: new ObjectId(doc.empId) }, { $inc: { 'medical': -duration } });
      console.log("update inc");
    }





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
  let hrid = req.headers.hrid;
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
  let data;
  if (req.headers.category == 'all') {
    data = await EmployeeModel.aggregate([
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
        $lookup: {
          from: "leavebalances",
          localField: "_id",
          foreignField: "empId",
          as: "balance",
        },
      },
      {
        $unwind: "$result",
      },
      {
        $unwind: "$balance",
      },
      {
        $match: {
          "result.category": {
            $in: ['casual', 'medical', 'compensatory', 'half 1', 'half 2', 'short'],
          },
          "result.from": {
            $gte: new Date(from),
          },
          "result.to": {
            $lte: new Date(to),
          },
        },
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
              url: "$result.document",
              duration: "$result.duration",  
              balance: "$balance",
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
                ],
              },
            },
          },
        },
      },
    ])
  }
  else {
    data = await EmployeeModel.aggregate([
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
        $lookup: {
          from: "leavebalances",
          localField: "_id",
          foreignField: "empId",
          as: "balance",
        },
      },
      {
        $unwind: "$result",
      },
      {
        $unwind: "$balance",
      },
      {
        $match: {
          "result.category": {
            $eq: req.headers.category,
          },
          "result.from": {
            $gte: new Date(from),
          },
          "result.to": {
            $lte: new Date(to),
          },
        },
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
              url: "$result.document",
              duration: "$result.duration",
              balance: "$balance",
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
                ],
              },
            },
          },
        },
      },
    ])
  }
  console.log('filter ', data);
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