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
  

module.exports = { candidates };