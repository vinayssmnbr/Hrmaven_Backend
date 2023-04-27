const Leave = require("../models/leave")
const EmployeeModel = require("../models/employee/employeeModel");
const mongoose = require("mongoose");
const { setDefaultResultOrder } = require("dns/promises");
// to get all employee leave

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
        empId: req.body.empId,
        appliedOn: req.body.appliedOn,
        from: req.body.from,
        to: req.body.to,
        reason: req.body.reason,
        status: req.body.status,
        category: req.body.category,
        duration: req.body.duration,
        message: req.body.message,
        document: req.body.document,
    });
    try {
        // res.send("created")
        const saveLeave = await leave_var.save();
        res.send(saveLeave)
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
}

const pendingsFetch = async (req, res) => {
    // try {
    //     const pending = await EmployeeModel.aggregate(
    //         [{
    //                 $lookup: {
    //                     from: "employeeleaves",
    //                     localField: "_id",
    //                     foreignField: "empId",
    //                     as: "leaves",
    //                 },
    //             },
    //             {
    //                 $unwind: "$leaves",
    //             },
    //             {
    //                 $match: {
    //                     "leaves.status": "pending",
    //                 },
    //             },
    //             {
    //                 $project: {
    //                     uid: 1,
    //                     name: 1,
    //                     appliedOn: "$leaves.appliedOn",
    //                     from: "$leaves.from",
    //                     to: "$leaves.to",
    //                     reason: "$leaves.reason",
    //                     status: "$leaves.status",
    //                     category: "$leaves.category",
    //                     duration: "$leaves.duration",
    //                 },
    //             },
    //         ]
    //     )
    //     console.log(pending);
    //     res.send(pending);
    // } catch (error) {
    //     res.send("error")
    // }
    console.log("pending");
}

const leavegraph = async (req, res) => {
    const graphcontent = await Leave.aggregate(
        [
            {
                $group: {
                    _id: "$status",
                    attendance: {
                        $push: {
                            status: "$status",
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
    res.send(graphcontent);

}


const leavecontent = async(req,res)=>{

    var date = new Date();
    // Get year, month, and day part from the date
    var year = date.toLocaleString("default", { year: "numeric" });
    var month = date.toLocaleString("default", { month: "2-digit" });
    var day = date.toLocaleString("default", { day: "2-digit" });
    
    // Generate yyyy-mm-dd date string
    var today = year + "-" + month + "-" + day
    console.log(today);


    const data = await Leave.aggregate([
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
                  "$$item.from", new Date("2023-04-01"),
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


const leaveupdatestatus =async(req,res)=>{
    try{
        
        const doc= await Leave.findById(req.headers.id);
        console.log(doc);
        doc.status=req.headers.status;
        doc.message=req.headers.message;
        doc.save();
        res.json({reponse:'update'});
    }
    catch(e)
    {
        res.send(e);
    }
}

const leavefilter = async(req,res)=>{
  console.log(req.headers);
  const data = await Leave.aggregate([
    {
      $match: {
        from: {
          $gte: new Date("2023-04-01"),
        },
        to: {
          $lte:new Date("2023-04-30"),
        },
        category: {
          $in: [
            "casual",
            "medical",
            "urgent",
            "earned",
          ],
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

  res.json({result:data});

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
    leavefilter

}