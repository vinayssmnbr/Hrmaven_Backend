const express = require("express");
const router = express.Router();

const emplcontroller = require("../controllers/empController");
const { verify } = require("../middlewares/authentication.js");

const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const EmployeeModel = require("../models/employee/employeeModel");
const User = require("../models/credential");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(path.resolve(__dirname, "public")));
console.log(__dirname);

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/create", emplcontroller.createEmp);
router.post("/import", upload.single("csv"), emplcontroller.importUsers);
router.get("/getEmployees", emplcontroller.getEmployees);
router.get("/find", emplcontroller.getEmp);
router.get("/uid", emplcontroller.generateUid);
router.post("/export", emplcontroller.exportUsers);
router.get("/:id", emplcontroller.getsEmp);
router.patch("/update/:id", emplcontroller.update);
router.delete("/:id", emplcontroller.deleteEmployee);
router.get("/detail/fetch", verify, emplcontroller.employeedetail);
router.get("/checkemail/:email", emplcontroller.getEmployeeEmail);
router.get("/checkmobile/:mobile", emplcontroller.getEmployeeMobile);

module.exports = router;
