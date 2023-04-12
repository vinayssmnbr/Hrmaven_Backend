const Attendance = require('../models/attendance');

async function getAttendance(req, res, next) {
    try {
        const attendance = await Attendance.find();
        // const attendance = await Attendance.where({ 'date': {$gt:'2023-01-31',$lt:'2023-03-01'},'status':'present'});
        // console.log('Attendance records retrieved successfully! '+attendance);

        res.send(attendance)
    } catch (error) {
        next(error);
    }
}

async function createAttendance(req, res, next) {
    try {
        const attendance = new Attendance(req.body);
        await attendance.save();
        console.log('New attendance record added successfully!');
        res.json(attendance);
    } catch (error) {
        next(error);
    }
}

async function updateAttendance(req, res, next) {
    try {
        const { id } = req.params;
        const attendance = await Attendance.findByIdAndUpdate(
            id,
            req.body, { new: true }
        );
        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        console.log(`Attendance record with id ${id} updated successfully!`);
        res.json(attendance);
    } catch (error) {
        next(error);
    }
}

async function deleteAttendance(req, res, next) {
    try {
        const { id } = req.params;
        const attendance = await Attendance.findByIdAndDelete(id);
        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        console.log(`Attendance record with id ${id} deleted successfully!`);
        res.json(attendance);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance,
};