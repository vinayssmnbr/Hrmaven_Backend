const Attendance = require('../models/attendance');

async function getAttendance(req, res, next) {
    try {
        const attendance = await Attendance.find();


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


async function getreport(req, res, next) {
    var start = [];
    var end = [];

    for (let i = 0; i < 12; i++) {
        var date = new Date();
        var year = date.getFullYear();
        if (i + 1 < 10) {
            start.push(year + '-0' + (i + 1) + '-01');

        }
        else {
            start.push(year + '-' + (i + 1) + '-01');
        }
    }

    for (let i = 0; i < 12; i++) {
        if (i + 1 < 9) {
            end.push(year + '-0' + (i + 2) + '-01')
        }
        else if (i + 2 == 13) {
            end.push(year + 1 + '-0' + (1) + '-01')
        }
        else {
            end.push(year + '-' + (i + 2) + '-01')
        }
    }

    let present = [];
    let absent = [];
    let leave = [];
    for (let i = 0; i < 12; i++) {
        try {
            present[i] = await Attendance.where({ 'date': { $gt: start[i], $lt: end[i] }, 'status': 'present' }).countDocuments();
            absent[i] = await Attendance.where({ 'date': { $gt: start[i], $lt: end[i] }, 'status': 'absent' }).countDocuments();
            leave[i] = await Attendance.where({ 'date': { $gt: start[i], $lt: end[i] }, 'status': 'leave' }).countDocuments();

        } catch (error) {
            next(error);
        }
    }
    res.json({ "present": present, "absent": absent, "leave": leave });
}

async function updateleavestatus(req, res) {
    // console.log(req.body);
    // res.send(req.body);
    const request = req.body;
    if (request.status == 'accept') {
        try {
            request.Array.map(async (value) => {
                const attendance = new Attendance({
                    empId: Number(request.empId),
                    name: request.name,
                    status: 'leave',
                    date: value
                })
                await attendance.save();
            }
            )
        } catch (error) {
            res.send(err);
        }
        res.send('done it');
    } else {
        try {
            request.Array.map(async(value) => {
                await Attendance.findOneAndDelete({ empId: Number(request.empId), name: request.name, date: value });
            })
        } catch (err) {
            res.send(err);
        }
    }
}
module.exports = {
    getreport,
    getAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    updateleavestatus
};