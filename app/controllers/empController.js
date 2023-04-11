const EmployeeModel = require('../models/employeeModel')
const { getAllEmployees } = require('../helper/employeeHelper');
const employeeService = require('../services/employeeService');


//Add employee
//http://localhost:8000/api/create

const createEmp = async(req, res) => {
    const { employeeId, name, designation, email, contact, accountno, address, adhaarno, bankname, dateOfBirth, dateOfJoining, gender, ifsc, mobile, panno } = req.body;
    const user = await EmployeeModel.findOne({ email: email });
    if (user) {
        res.send({ status: "failed", message: "Email already exists in the register" });
    } else {
        if (employeeId && name && email && designation && contact && accountno && address && adhaarno && bankname && dateOfBirth && dateOfJoining && gender && ifsc && mobile && panno) {
            try {


                const newuser = new EmployeeModel({
                    employeeId: employeeId,
                    email: email,
                    name: name,
                    designation: designation,
                    contact: contact,
                    accountno: accountno,
                    address: address,
                    adhaarno: adhaarno,
                    bankname: bankname,
                    dateOfBirth: dateOfBirth,
                    dateOfJoining: dateOfJoining,
                    gender: gender,
                    ifsc: ifsc,
                    mobile: mobile,
                    panno: panno
                });
                await newuser.save();
                const saved_user = await EmployeeModel.findOne({ email: email })

                res.send({ status: "Success", message: "Added Successfully" });
            } catch (error) {
                console.log(error);
                res.send({ status: "failed", message: "unable to Added" });
            }
        } else {
            res.send({ status: "failed", message: "All fields are required" });
        }
    }
};





const getEmp = async(req, res) => {
    try {
        const employees = await getAllEmployees();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};




const getsEmp = async(req, res) => {
    res.json(res.employee);
};




const update = (req, res) => {
    if (!req.body) {
        return res
            .status(400)
            .send({ message: "Data to update can not be empty" })
    }

    const id = req.body.id;
    EmployeeModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot Update user with ${id}. Maybe user not found!` })
            } else {
                res.send(data)
            }

        })
        .catch(err => {
            res.status(500).send({ message: "Error Update user information" })
        })
}




const deleteEmployee = (req, res) => {
    const id = req.body.id;

    employeeService.deleteEmployee(id)
        .then(message => {
            res.send({ message });
        })
        .catch(err => {
            res.status(500).send({ message: err });
        });
};

module.exports = {
    createEmp,
    deleteEmployee,
    update,
    getEmp,
    getsEmp
}