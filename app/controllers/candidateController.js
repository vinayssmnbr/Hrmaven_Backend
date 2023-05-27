const candidateModal = require("../models/candidate");
var ObjectId = require("mongodb").ObjectId;
const jobvacancies = require("../models/jobVacancies");
const candidate_mobilecheck = require("../helper/candmobilecheck");
const candidate_emailcheck = require("../helper/candemailcheck");
// const Data=require()

const candidates = async (req, res) => {
  const {
    jobId,
    candidateName,
    candidate_Id,
    contactnumber,
    email,
    applieddate,
    url,
    status,
    uid,
    empId,
  } = req.body;

  try {
    const data = new candidateModal({
      ...req.body,
      jobId: new ObjectId(req.body.jobId),
      empId: new ObjectId(req.body.empId),
    });

    const dataSave = await data.save();
    console.log(dataSave);
    await jobvacancies.findByIdAndUpdate(jobId, { $inc: { uid: 1 } });
    res.send({ status: "Success", message: "Added Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

//for update

const updated = async (req, res) => {
  try {
    if (!req.body) {
      return res
        .status(400)
        .send({ message: "Data to be updated cannot be empty" });
    }

    const id = req.params.id;

    const data = await candidateModal.findByIdAndUpdate(id, req.body);

    if (!data) {
      return res.status(404).send({
        message: `Cannot update user with ID ${id}. User not found!`,
      });
    }

    res.send({ message: "Update success" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error updating user information" });
  }
};

//for generate uid

const generatecanUid = async (req, res) => {
  try {
    let jobId = req.headers.jobid;
    let doc = await jobvacancies.findById(jobId);

    var uid = doc.uid;
    res.send({ uid });
  } catch (error) {
    console.log(error);
    res.send({
      msg: "error",
    });
  }
};

//for get email of candidate

const getCandidateEmail = async (req, res) => {
  const { email } = req.params;
  if (!email || email.trim() === "") {
    res.status(400).json({ message: "Email address is required" });
    return;
  }
  try {
    const candidate = await candidate_emailcheck.getCredentialsByEmail(email);
    if (candidate) {
      res.send({
        message: `user-found`,
        email,
        flag: true,
      });
    } else {
      res.send({
        message: `email-id not found`,
        email,
        flag: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching user mobile" });
  }
};

//for get candidate mobile

const getCandidateMobile = async (req, res) => {
  const { contactnumber } = req.params;
  if (!contactnumber || contactnumber.trim() === "") {
    res.status(400).json({ message: "contactnumber is required" });
    return;
  }
  try {
    const employee = await candidate_mobilecheck.getCredentialsBymobile(
      contactnumber
    );
    if (employee) {
      res.send({
        message: "user-found",
        contactnumber,
        flag: true,
      });
    } else {
      res.send({
        message: "contactnumber not found",
        contactnumber,
        flag: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching user contactnumber" });
  }
};

//for getall data

const getCandidate = async (req, res) => {
  let userId = req.headers.jobid;
  let empId = req.headers.empid;
  // let id=req.headers.id
  try {
    console.log(userId);
    const Candidate = await candidateModal.find({
      jobId: new ObjectId(userId),
      empId: new ObjectId(empId),
    });
    res.json(Candidate);
  } catch (error) {
    console.log(error);
    res.send({
      msg: "Data can not find",
    });
  }
};

const oldpasswordcheck = async (req, res) => {
  candidate_emailcheck.getolpassword(req, res);
};

module.exports = {
  candidates,
  updated,
  getCandidateMobile,
  getCandidateEmail,
  getCandidate,
  generatecanUid,
  oldpasswordcheck,
};
