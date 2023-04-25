const express = require("express");
const router = express.Router();
const employeespecificdetailsroutes = require('../controllers/employeespecificdetails')


router.post("/employeespecificdetails/:id", employeespecificdetailsroutes.employeespecificdetails);



module.exports = router;
