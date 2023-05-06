const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const empside = require('../controllers/eside');

router.get('/', attendanceController.getAttendance);
router.post('/', attendanceController.createAttendance);
// router.patch('/:id', attendanceController.updateAttendance);
// router.delete('/:id', attendanceController.deleteAttendance);
router.get('/report',attendanceController.getreport);
router.post('/update/leave',attendanceController.updateleavestatus)
router.get('/all',attendanceController.getEmployeeAttendance);
router.get('/date/attendance',attendanceController.dateWiseAttendance);
router.get("/date/attendancecard",attendanceController.dateWiseCard);
router.get("/date/report",attendanceController.Attendancegraph);
router.get("/emp/attendance",attendanceController.employeerecord);
router.get("/check/empattendance",attendanceController.attendanceMark);
router.patch('/update/time',attendanceController.markattendance);
router.post('/emp/punchin',attendanceController.punchin);
router.post('/emp/punchout',attendanceController.punchout);
router.get("/emp/donut",empside.leavedonut);
module.exports = router;
