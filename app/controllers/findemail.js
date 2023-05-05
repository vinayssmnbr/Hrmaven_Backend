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
  const getEmployeeByUsername = async (req, res) => {
    var { username } = req.params;
    if (!username || username.trim() === '') {
      res.status(400).json({ message: "Username is required" });
      return;
    }
    username = new RegExp(`^${username}$`, "i"); // Create a case-insensitive regular expression
    try {
      const employee = await employee_email.getCredentialsByUsername( username );
      if (employee) {
        res.send({
          message: "user-found",
          username: employee.username,
        });
      } else {
        res.send({
          message: "username not found",
          username,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching user by username" });
    }
  };
  

module.exports = {
    getEmployeeEmail,
    getEmployeeByUsername
}