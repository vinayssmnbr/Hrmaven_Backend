const router = require("express").Router();
const leaveController = require('../controllers/leaveController');
const empleave = require('../controllers/eside');

const User = require("../models/credential");

console.log("leave route");
router.post("/add/leave", leaveController.leave_create);
router.get('/all', leaveController.leave_all);
router.patch("/:id", leaveController.updateStatus);
router.get("/:employeeId", leaveController.leave_details);
router.get("/graph/leave",leaveController.leavegraph);
router.get("/data/leaves",leaveController.leavecontent);
router.patch("/update/leave",leaveController.leaveupdatestatus);
router.get("/filter/leave",leaveController.leavefilter);

// employee side leave route
router.get("/emp/leave",empleave.leaveBalanceChart);
router.get("/emp/history",empleave.leaveHistory);

module.exports = router