const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.get('/', attendanceController.getAttendance);
router.post('/', attendanceController.createAttendance);
// router.patch('/:id', attendanceController.updateAttendance);
// router.delete('/:id', attendanceController.deleteAttendance);
router.get('/report',attendanceController.getreport);
router.post('/update',attendanceController.updateleavestatus)
router.get('/all',attendanceController.getEmployeeAttendance);
router.get('/date/attendance',attendanceController.dateWiseAttendance);
router.get("/date/attendancecard",attendanceController.dateWiseCard);
router.get("/date/report",attendanceController.Attendancegraph);
module.exports = router;
