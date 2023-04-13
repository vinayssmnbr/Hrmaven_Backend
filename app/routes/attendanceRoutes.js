const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.get('/', attendanceController.getAttendance);
router.post('/', attendanceController.createAttendance);
router.patch('/:id', attendanceController.updateAttendance);
router.delete('/:id', attendanceController.deleteAttendance);
router.get('/report',attendanceController.getreport);

module.exports = router;