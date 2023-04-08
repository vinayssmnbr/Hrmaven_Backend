const router = require("express").Router();
const leaveController = require('../controllers/leaveController');

router.post("/add",leaveController.leave_create);
router.get("/",leaveController.leave_all);
router.get("/:employeeId",leaveController.leave_details);



module.exports = router