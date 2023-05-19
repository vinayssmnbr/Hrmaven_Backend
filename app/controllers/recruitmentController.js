const jobvacancies = require("../models/jobVacancies");
var ObjectId = require("mongodb").ObjectId;
const recruiter = require("../models/recruiterModal");
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
    // const employee = await EmployeeModel.findOne({ email: req.body.email });
    // const empId = employee ? employee._id : null;
    // dataSave.empId = empId;
    // await dataSave.save();
    // const Recruiter = new recruiter({
    //   jobId: new ObjectId(dataSave._id),
    //   email: data._id,
    //   name: data.name,
    // });
    // const recruitersave = await Recruiter.save();
    // console.log("bch", recruitersave);
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
module.exports = { vacancies, vacancieDetails };
