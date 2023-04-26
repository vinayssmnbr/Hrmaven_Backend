const express = require("express");
const router = express.Router();
const employeespecificdetailsroutes = require('../controllers/employeespecificdetails')
const {updateUser} = require('../controllers/employeespecificdetails')

router.post("/employeespecificdetails/:id", employeespecificdetailsroutes.employeespecificdetails);
router.put('/users/:id', updateUser);
router.put('/comapnies/:id',employeespecificdetailsroutes.updateCompany)
// router.put('/companies/:id', updateCompany);


module.exports = router;
