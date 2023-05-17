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
    job_type,
    skill,
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

const recruitermodal = async (req, res) => {
  const { jobId, name, url, email } = req.body;
  try {
    const Recruiter = new recruiter({
      ...req.body,
      jobId: new ObjectId(req.body.jobId),
      empId: new ObjectId(req.body.empId),
    });
    const rec = await Recruiter.save();
    const employee = await recruiter
      .find({ _id: req.body.empId })
      .populate("empId");
    console.log(employee);

    res.send({ status: "Success", message: "Added Successfully" });
  } catch (error) {
    console.log(error);
    res.send({
      message: "error",
    });
  }
};
module.exports = { vacancies, recruitermodal };
