const EmployeeModel = require("../models/employee/employeeModel");
const Empcreditional = require("../models/empcredit");
const bcrypt = require("bcryptjs");
const { User } = require("../models/credential");

const findemailhelper = {};

findemailhelper.getCredentialsByEmail = async function (email) {
  try {
    const employee = await EmployeeModel.findOne({ email: email });
    const user = await User.findOne({ email: email });
    if (employee || user) {
      return true;
    }
  } catch (error) {
    console.log("Error in retrieving user by email:", error);
    throw error;
  }
};

//OLD PASSWORD AMTCH
findemailhelper.getolpassword = async (req, res) => {
  const { oldpassword } = req.body;
  const email = req.params.email;
  try {
    const user = await Empcreditional.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(oldpassword, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .send({ message: "Incorrect password", flag: false });
    }

    return res.status(200).send({ message: "Password matches", flag: true });
  } catch (err) {
    console.error(err);
    return res.status(404).send({ message: "Error fetching user password" });
  }
};

module.exports = findemailhelper;
