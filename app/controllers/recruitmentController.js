const jobvacancies = require("../models/jobVacancies");
var ObjectId = require("mongodb").ObjectId;
const EmployeeModel = require("../models/employee/employeeModel");
const Meeting = require("../models/meeting");
const candidateModal = require("../models/candidate");
const jobVacanciesModal = require("../models/jobVacancies");
const cron = require("node-cron");

const vacancies = async (req, res) => {
  const {
    job_title,
    date,
    status,
    location,
    experience,
    ctc,
    skill,
    job_type,
    list,
    job_description,
    hrid,
  } = req.body;
  try {
    const data = new jobvacancies({
      ...req.body,
      hrId: new ObjectId(req.body.hrid),
    });
    const dataSave = await data.save();
    console.log(dataSave);
    res.send({ status: "Success", message: "Added Successfully" });
  } catch (error) {
    console.log(error);
    res.send({
      msg: "error",
    });
  }
};

const vacancieDetails = async (req, res) => {
  let userId = req.headers.hrid;
  try {
    const vacancieData = await jobvacancies.find({
      hrId: new ObjectId(userId),
    });

    res.json({ response: vacancieData });
  } catch (error) {
    console.log(error);
    res.send({
      msg: "Data can not find",
    });
  }
};

const employeeDetail = async (req, res) => {
  let userId = req.headers.hrid;
  const data = await EmployeeModel.aggregate([
    {
      $match: {
        company: new ObjectId(userId),
      },
    },
    {
      $project: {
        name: 1,
        url: 1,
        professionalemail: 1,
        designation: 1,
        _id: 1,
      },
    },
  ]);

  res.json({ data });
};

const fetchjobVancancies = async (req, res) => {
  let userId = req.headers.id;
  const data = await EmployeeModel.aggregate([
    {
      $match: {
        _id: new ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "jobvacancies",
        localField: "company",
        foreignField: "hrId",
        as: "job",
      },
    },
    {
      $project: {
        job: 1,
      },
    },
  ]);
  res.json({ data });
};

//MEETING
cron.schedule("* * * * * ", async function () {
  var date = new Date();
  console.log(date.toISOString());
  var now_utc = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
  var endTime = new Date(now_utc);
  var data = await Meeting.find({
    end_time: { $lte: new Date(date.toISOString()) },
  });

  data.map(async (item) => {
    console.log(item);
    await Meeting.findByIdAndDelete(item._id);
  });
});

const meeting = async (req, res) => {
  const { meeting_title, mode, date, start_time, end_time, invite_employee } =
    req.body;
  var startTime = new Date(date);
  var start_part = req.body.start_time.split(":");
  startTime.setHours(start_part[0]);
  startTime.setMinutes(start_part[1]);

  var endTime = new Date(date);
  var end_part = req.body.end_time.split(":");
  endTime.setHours(end_part[0]);
  endTime.setMinutes(end_part[1]);

  try {
    const data = new Meeting({
      ...req.body,
      start_time: new Date(startTime),
      end_time: new Date(endTime),
      candidateId: new ObjectId(req.body.statusid),
    });
    const meetingSave = await data.save();
    console.log(meetingSave);
    res.send({ status: "Success", message: "Meeting Added Successfully" });
  } catch (error) {
    console.log(error);
    res.send({
      msg: "error",
    });
  }
};

const readMeeting = async (req, res) => {
  const id = req.headers.id;
  const role = req.headers.role;
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate());
  tomorrow.setHours(0, 0, 0, 0);
  const data = await jobvacancies.aggregate([
    {
      $match: {
        hrId: new ObjectId(id),
      },
    },
    {
      $project: {
        _id: 1,
      },
    },
    {
      $lookup: {
        from: "candidates",
        localField: "_id",
        foreignField: "jobId",
        as: "result",
      },
    },
    {
      $unwind: "$result",
    },
    {
      $lookup: {
        from: "meetings",
        localField: "result._id",
        foreignField: "candidateId",
        as: "meetings",
      },
    },
    {
      $unwind: "$meetings",
    },
    {
      $match: {
        "meetings.end_time": {
          $gte: new Date(tomorrow),
        },
      },
    },
    {
      $group: {
        _id: null,
        meeting: {
          $push: "$meetings",
        },
      },
    },
  ]);

  res.json({ data });

  // if (role == 'employee') {
  //   try {
  //     var date = new Date();
  //     var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
  //       date.getUTCDate(), date.getUTCHours(),
  //       date.getUTCMinutes(), date.getUTCSeconds());
  //     var endTime = new Date(now_utc);
  //     var data = await Meeting.find({ date: { $lte: new Date(endTime) } }, { candidateId: new ObjectId(id) });
  //     res.json(data);

  //   } catch (e) {
  //     res.status(400);
  //   }
  // }
  // else{

  // }
};
const activityfeed = async (req, res) => {
  const hrid = req.headers.hrid;
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  today = today.toString();
  const data = await jobvacancies.aggregate([
    {
      $match: {
        hrId: new ObjectId(hrid),
      },
    },
    {
      $lookup: {
        from: "candidates",
        localField: "_id",
        foreignField: "jobId",
        as: "job",
      },
    },
    {
      $unwind: "$job",
    },
    {
      $match: {
        "job.applieddate": { $gte: new Date(today) },
      },
    },
    {
      $project: {
        job_title: 1,
        _id: 0,
        candidate: "$job.candidateName",
        date: "$job.applieddate",
      },
    },
  ]);
  res.json({ data });
};

const dynamicrecord = async (req, res) => {
  const hrid = req.headers.hrid;
  const data = await jobvacancies.aggregate([
    {
      $match: {
        hrId: new ObjectId(hrid),
      },
    },
    {
      $lookup: {
        from: "candidates",
        localField: "_id",
        foreignField: "jobId",
        as: "job",
      },
    },
    {
      $unwind: "$job",
    },
    {
      $group: {
        _id: "$hrId",
        job: {
          $push: "$job",
        },
      },
    },
    {
      $project: {
        job: 1,
        _id: 0,
      },
    },
    {
      $addFields: {
        hired: {
          $size: {
            $filter: {
              input: "$job",
              as: "item",
              cond: {
                $and: [
                  {
                    $eq: ["$$item.status", "Hired"],
                  },
                ],
              },
            },
          },
        },
        reject: {
          $size: {
            $filter: {
              input: "$job",
              as: "item",
              cond: {
                $and: [
                  {
                    $eq: ["$$item.status", "Rejected"],
                  },
                ],
              },
            },
          },
        },
        shortlisted: {
          $size: {
            $filter: {
              input: "$job",
              as: "item",
              cond: {
                $and: [
                  {
                    $eq: ["$$item.status", "Shortlisted"],
                  },
                ],
              },
            },
          },
        },
        total: {
          $size: "$job",
        },
      },
    },
  ]);
  res.json({ data });
};

cron.schedule(
  "0 23 * * * ",
  function () {
    console.log("schedule");
    jobdone();
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);
const jobdone = async (req, res) => {
  const data = await jobvacancies.find({
    date: { $lt: new Date() },
    status: "",
  });
  data.map(async (item) => {
    await jobvacancies.findByIdAndUpdate(item._id, { status: "complete" });
  });
};

const fetchmeetingEpSide = async (req, res) => {
  const id = req.headers.id;
  const daa = await EmployeeModel.findById(id);
  const data = await Meeting.aggregate([
    {
      $unwind: "$list",
    },
    {
      $addFields: {
        email: "$list.professionalemail",
      },
    },
    {
      $match: {
        email: daa.professionalemail,
      },
    },
  ]);
  res.json({ data });
};

module.exports = {
  vacancies,
  vacancieDetails,
  employeeDetail,
  fetchjobVancancies,
  meeting,
  activityfeed,
  dynamicrecord,
  readMeeting,
  fetchmeetingEpSide,
};
