const express = require("express");
const router = express.Router();

const emplcontroller = require("../controllers/empController");
const {verify} = require("../middlewares/authentication.js")

router.post("/create", emplcontroller.createEmp);
router.get("/find", emplcontroller.getEmp);
router.get("/uid", emplcontroller.generateUid);
router.get("/:id", emplcontroller.getsEmp);
router.patch("/update/:id", emplcontroller.update);
router.delete("/:id", emplcontroller.deleteEmployee);
router.get("/detail/fetch",verify, emplcontroller.employeedetail);
router.get("/checkemail/:email",emplcontroller.getEmployeeEmail)

module.exports = router;
