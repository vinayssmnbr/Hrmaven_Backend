const Attendance = require('../models/attendance');
const Employee = require("../models/employee/employeeModel");
var ObjectId = require('mongodb').ObjectId;

async function getAttendance(req, res, next) {
  try {
    const attendance = await Attendance.find();
    res.send(attendance)
  } catch (error) {
    next(error);
  }
}

async function createAttendance(req, res, next) {
  try {
    const { empId, date, status } = req.body;
    const existingAttendance = await Attendance.findOne({ empId, date });
    if (existingAttendance) {
      existingAttendance.status = status;
      await existingAttendance.save();
      console.log(`Attendance record for empId ${empId} and date ${date} updated successfully!`);
      res.json(existingAttendance);
    } else {
      const attendance = new Attendance(req.body);
      await attendance.save();
      console.log('New attendance record added successfully!');
      res.json(attendance);
    }
  } catch (error) {
    next(error);
  }
}
async function updateAttendance(req, res, next) {
  try {
    const { id } = req.params;
    const attendance = await Attendance.findByIdAndUpdate(
      id,
      req.body, { new: true }
    );
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    console.log(`Attendance record with id ${id} updated successfully!`);
    res.json(attendance);
  } catch (error) {
    next(error);
  }
}

async function deleteAttendance(req, res, next) {
  try {
    const { id } = req.params;
    const attendance = await Attendance.findByIdAndDelete(id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    console.log(`Attendance record with id ${id} deleted successfully!`);
    res.json(attendance);
  } catch (error) {
    next(error);
  }
}


async function getreport(req, res, next) {
  var start = [];
  var end = [];

  for (let i = 0; i < 12; i++) {
    var date = new Date();
    var year = date.getFullYear();
    if (i + 1 < 10) {
      start.push(year + '-0' + (i + 1) + '-01');

    } else {
      start.push(year + '-' + (i + 1) + '-01');
    }
  }

  for (let i = 0; i < 12; i++) {
    if (i + 1 < 9) {
      end.push(year + '-0' + (i + 2) + '-01')
    } else if (i + 2 == 13) {
      end.push(year + 1 + '-0' + (1) + '-01')
    } else {
      end.push(year + '-' + (i + 2) + '-01')
    }
  }

  let present = [];
  let absent = [];
  let leave = [];
  for (let i = 0; i < 12; i++) {
    try {
      present[i] = await Attendance.where({ 'date': { $gt: start[i], $lt: end[i] }, 'status': 'present' }).countDocuments();
      absent[i] = await Attendance.where({ 'date': { $gt: start[i], $lt: end[i] }, 'status': 'absent' }).countDocuments();
      leave[i] = await Attendance.where({ 'date': { $gt: start[i], $lt: end[i] }, 'status': 'leave' }).countDocuments();

    } catch (error) {
      next(error);
    }
  }
  res.json({ "present": present, "absent": absent, "leave": leave });
}

async function updateleavestatus(req, res) {

  console.log(req.body);
  const empdata = await Employee.find({ uid: req.body.uid });
  console.log(empdata);
  const id = empdata._id;


  try {
    req.body.Array.map(async (value) => {
      const attendance = new Attendance({
        empId: id,
        status: 'leave',
        date: value
      })
      await attendance.save();
    })
  } catch (error) {
    res.send(err);
  }
  res.json({ response: "done" });

}

async function getEmployeeAttendance(req, res) {
  try {
    let attendance;
    if (true) {
      attendance = await Attendance.aggregate([
        { $group: { _id: "$empId", data: { $push: "$date" }, punch_in: { $push: "$punch_in" }, punch_out: { $push: "$punch_out" } } }
      ]);
      const presentCount = await Attendance.countDocuments({ status: 'present' });
      for (let i = 0; i < attendance.length; i++) {
        const data = await Employee.findById(attendance[i]._id);
        attendance[i].uid = data.uid;
        attendance[i].name = data.name;
        attendance[i].designation = data.designation;
      }
    }
    res.send(attendance)
  } catch (error) {
    res.send(error);
  }




}


const dateWiseAttendance = async (req, res) => {
  const mydate = req.headers.mydate;
  const attendance = await Employee.aggregate(
    [
      {
        $lookup: {
          from: "attendances",
          localField: "_id",
          foreignField: "empId",
          as: "attendances",
        },
      },
      {
        $unwind: "$attendances",
      },

      {
        $project: {
          uid: 1,
          name: 1,
          date: "$attendances.date",
          status: "$attendances.status",
          in: "$attendances.punch_in",
          out: "$attendances.punch_out",
          designation: 1,
        },
      },
      {
        $match:
        {
          "date": { $eq: new Date(mydate) },
        },
      },
    ]
  )
  // console.log("date"+attendance);
  res.send(attendance);
}

const dateWiseCard = async (req, res) => {
  const d = new Date();
  const month = req.headers.month;
  const m = Number(month);
  const year = d.getFullYear();
  let firstday = new Date(year, m, 1);
  let lastday = new Date(year, m + 1, 0);
  // console.log(firstday);
  // console.log(lastday);

  const attendance = await Employee.aggregate(
    [
      {
        $lookup: {
          from: "attendances",
          localField: "_id",
          foreignField: "empId",
          as: "attendance",
        },
      },
      {
        $unwind: "$attendance",
      },
      {
        $project: {
          uid: 1,
          name: 1,
          designation: 1,
          date: "$attendance.date",
          status: "$attendance.status",
          empId: "$attendance.empId",
          _id: "$attendance._id",
          in: "$attendance.punch_in",
          out: "$attendance.punch_out",
        },
      },
      {
        $match: {
          date: {
            $lte: new Date(lastday),
            $gte: new Date(firstday),
          },
        },
      },
      {
        $group: {
          _id: {
            uid: "$uid",
            name: "$name",
            designation: "$designation",
            empId: "$empId",
          },
          attendance: {
            $push: {
              date: "$date",
              status: "$status",
              in: "$in",
              out: "$out",
            },
          },
        },
      },
      {
        $addFields: {
          totalcount: {
            $size: "$attendance",
          },
          leavecount: {
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
          presentcount: {
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
          absentcount: {
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
        },
      },
      {
        $addFields: {
          percent: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [
                      "$presentcount",
                      "$totalcount",
                    ],
                  },
                  100,
                ],
              },
            ],
          },
        },
      },
      {
        $project:
        {
          name: "$_id.name",
          uid: "$_id.uid",
          _id: 1,
          attendance: 1,
          totalcount: 1,
          leavecount: 1,
          presentcount: 1,
          absentcount: 1,
          percent: 1,
        },
      },
    ]

  )
  res.send(attendance);
}

const Attendancegraph = async (req, res) => {
  const record = await Attendance.aggregate(
    [
      {
        $project: {
          month: {
            $month: "$date",
          },
          status: 1,
        },
      },
      {
        $group: {
          _id: {
            month: "$month",
            // status: "$status",
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
        },
      },
      {
        $project: {
          month: "$_id.month",
          absent: 1,
          present: 1,
          leave: 1,
          _id: 0,
        },
      },
    ]
  );
  res.send(record);
}

const employeerecord = async (req, res) => {
  const id = req.headers.id;
  const data = await Attendance.find({ empId: new ObjectId(id) });
  console.log(data);
  res.json({ response: data });
}

const intializeAttendanceDaily = async (req, res) => {
  console.log("initialize");
  const initialize = await Employee.aggregate([
    {
      $match:
      {
        status: "active",
      },
    },
    {
      $project:
      {
        _id: 0,
        empId: "$_id",
        status: "absent",
        date: new Date(),
        from: "",
        to: "",
      },
    },
  ])


  // const todayAtt = await Attendance.insertMany(initialize).then(function (d) {
  //   console.log("Data inserted")
  // }).catch(function (error) {
  //   console.log(error)      // Failure
  // });


}

const markattendance = async(req,res)=>{
  const id = req.headers.id;
  let today = new Date();
  let tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  today = today.toString();
  tomorrow = tomorrow.toString();
  const check = await Attendance.findOneAndUpdate({date:{$gte: new Date(today),$lt: new Date(tomorrow)},empId: new ObjectId(id)},{punch: new Date()});
  res.json({res:check});
  
}
const attendanceMark = async (req, res) => {
  const id = req.headers.id;
  let today = new Date();
  let tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  today = today.toString();
  tomorrow = tomorrow.toString();
  const check = await Attendance.find({date:{$gte: new Date(today),$lt: new Date(tomorrow)},empId: new ObjectId(id)});
  console.log("check",check);
  if(check.length==0)
  {
    console.log("iflse");
    res.json({response:'noresponse'});
  }
  else if(check[0].status=='absent' || check[0].status=='leave')
  {
    res.json({in:"----",out:"-----"});
  }
  else {
    res.json({in:check[0].punch_in,out:check[0].punch_out});
  }

}

// intializeAttendanceDaily();
module.exports = {
  getreport,
  getAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  updateleavestatus,
  getEmployeeAttendance,
  dateWiseAttendance,
  dateWiseCard,
  Attendancegraph,
  employeerecord,
  intializeAttendanceDaily,
  attendanceMark,
  markattendance

};