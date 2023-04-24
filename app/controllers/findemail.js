const employee_email = require("../helper/forgotemail")

// to get all employee email
const getEmployeeEmail = async (req, res) => {
    const { email } = req.params;
    if (!email || email.trim() === '') {
      res.status(400).json({ message: "Email address is required" });
      return;
    }
    try {
      const employee = await employee_email.getCredentialsByEmail(email);
      if (employee) {
        res.send({
          message: `user-found`,
          email,
        });
      } else {
        res.send({
            message: `email-id not found`,
            email,
          });
        // res.status(404).json({ message:`No user found with email ${email}` });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching user email" });
    }
  };



module.exports = {
    getEmployeeEmail
}