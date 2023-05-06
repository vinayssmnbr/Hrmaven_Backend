const express = require("express");
const router = express.Router();
const emaildata = require('../controllers/findemail');

// router.get("/all", emaildata.email_all);
router.get("/email/:email", emaildata.getEmployeeEmail);
router.get("/username/:username", emaildata.getEmployeeByUsername);


module.exports = router;
