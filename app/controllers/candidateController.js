const candidateModal = require("../models/candidate");
const candidate = require("../models/candidate");
var ObjectId = require("mongodb").ObjectId;
// const Data=require()

const candidates = async (req, res) => {
    const {
      candidate_name,
      candidate_Id,
      contact_number,
      email,
      applied_date,
      resume,
      status,
      jobId,
     
    } = req.body;
  
    try {

      const data = new candidate({
       ...req.body,
       jobId:new ObjectId(req.body.jobId)
      
      });
  
      const dataSave = await data.save();
      console.log(dataSave);
      res.send({ status: "Success", message: "Added Successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  };


  const updated = async (req, res) => {
    try {
      if (!req.body) {
        return res.status(400).send({ message: "Data to be updated cannot be empty" });
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
    const { mobile } = req.params;
    if (!mobile || mobile.trim() === "") {
      res.status(400).json({ message: "mobile is required" });
      return;
    }
    try {
      const candidate = await candidate_mobilecheck.getCredentialsByEmail(mobile);
      if (candidate) {
        res.send({
          message: `user-found`,
          mobile,
          flag: true,
        });
      } else {
        res.send({
          message: `mobile not found`,
          mobile,
          flag: false,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching user mobile" });
    }
  };
  

module.exports = { candidates,updated ,getCandidateMobile,getCandidateEmail};