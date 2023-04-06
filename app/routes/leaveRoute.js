const router = require("express").Router();
const leaveController = require('../controllers/leaveController');
router.post("/add",leaveController.leave_create);
router.get("/all",leaveController.leave_all);
router.get("/:employeeId",leaveController.leave_details);
router.put("/:employeeId",leaveController.leave_update);
router.delete("/:employeeId",leaveController.leave_delete);
module.exports = router;