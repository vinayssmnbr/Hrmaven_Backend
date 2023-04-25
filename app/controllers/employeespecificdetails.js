const User = require("../models/credential");
const employeespecificdetailsservice = require('../services/employeespecificdetails')


exports.employeespecificdetails = async function(req, res) {
    try {
        const specificDetails = await employeespecificdetailsservice.getSpecificDetails;
        res.status(200).json({ specificDetails });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      }
};


