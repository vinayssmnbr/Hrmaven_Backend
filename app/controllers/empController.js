
const EmployeeModel = require('../models/employeeModel')
const { getAllEmployees } = require('../helper/employeeHelper');
const employeeService = require('../services/employeeService');


   //Add employee
   //http://localhost:8000/api/create

    const  createEmp = async (req, res) => {
    const { uid, name,  designation,email,mobile, dateOfJoining, dateOfBirth , gender, address,bankname,adhaarno,accountno, ifsc,panno} = req.body;
    const user = await EmployeeModel.findOne({ email: email });
    if (user) {
      res.send({ status: "failed", message: "Email already exists in the register" });
    } else {
      if (uid && name && email &&  designation && mobile && dateOfJoining && dateOfBirth && gender && address &&  bankname &&  adhaarno && accountno && ifsc && panno) {
        try {
           
          
            const newuser = new EmployeeModel({
                uid:uid,
                email:email,
                name:name,
                designation:designation,
                mobile:mobile,
                dateOfBirth: dateOfBirth,
                dateOfJoining:dateOfJoining,
                gender: gender,
                address: address,
                bankname: bankname,
                adhaarno: adhaarno,
                accountno:accountno,
                ifsc: ifsc,
                panno:panno


          });
          await newuser.save();
          const saved_user = await EmployeeModel.findOne({ email: email })
         
          res.send({ status: "Success", message: "Added Successfully"  });
        } catch (error) {
          console.log(error);
          res.send({ status: "failed", message: "unable to Added" });
        }
      } else {
        res.send({ status: "failed", message: "All fields are required" });
      }
    }
  };

    
// GET  ALL Employee
// http://localhost:8000/api/find


const getEmp = async (req, res) => {
  try {
    const employees = await getAllEmployees();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//GET A specific Employee

const getsEmp=async(req, res) => {
    res.json(res.employee);
};

//Update a new idetified user by user id
//http://localhost:8000/api/:id
//patch


  const  update = (req, res)=>{
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const id = req.body.id;
    EmployeeModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update user with ${id}. Maybe user not found!`})
            }else{
                res.send(data)
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Update user information"})
        })
}


//Delete a user with with specified user id in the request
//delete
// http://localhost:8000/api/:id



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