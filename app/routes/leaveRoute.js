const router = require("express").Router();
const leaveController = require('../controllers/leaveController');
const User = require("../models/credential");

router.post("/add", leaveController.leave_create);
router.get('/all', leaveController.leave_all);
router.patch("/:id", leaveController.updateStatus);
router.get("/:employeeId", leaveController.leave_details);
router.get('/pending', leaveController.pendingsFetch);

module.exports = router