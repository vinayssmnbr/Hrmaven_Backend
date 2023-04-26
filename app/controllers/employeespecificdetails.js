const User = require("../models/credential");
const employeespecificdetailsservice = require('../services/employeespecificdetails')

exports.employeespecificdetails = async function(req, res) {
    try {
        const specificDetails = await employeespecificdetailsservice.getSpecificDetails;
        res.status(200).json({ specificDetails });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      }
};
//update personal profile
exports.updateUser = async(req,res)=>{
  const {id} = req.params;
  const {name,personalEmail,phoneNumber,professionalEmail} = req.body;
  try{
    const user = await User.findByIdAndUpdate(id,{
      name,
      personalEmail,
      phoneNumber,
      professionalEmail
    },{new:true});

    if(!user){
      return res.status(404).send('User not found');
    }
    res.send(user);
  }catch(error){
    console.error(error);
    res.status(500).send('Server error');
  }


}
//update  company profile
exports.updateCompany = async(req,res)=>{
  const {id} = req.params;
  const {name,numberOfEmployee,headOffice,description} = req.body;
  try{
    const company = await User.findByIdAndUpdate(id,{
      name,
      numberOfEmployee,
      headOffice,
      description
    },{new:true});
    if(!company){
      return res.status(404).send('Company not found');
    }
    res.send(comapny);
  }catch(error){
    console.error(error);
    res.status(500).send('Server error');
  }
}



