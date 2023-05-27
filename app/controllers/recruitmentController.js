const jobvacancies = require("../models/jobVacancies");
var ObjectId = require("mongodb").ObjectId;
const EmployeeModel = require("../models/employee/employeeModel");

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

module.exports = {
  vacancies,
  vacancieDetails,
  employeeDetail,
  fetchjobVancancies,
};
