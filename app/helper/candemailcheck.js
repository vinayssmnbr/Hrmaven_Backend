const CandidateModel = require("../models/candidate");
const Empcreditional = require("../models/candcredit");
const bcrypt = require("bcryptjs");
const { User } = require("../models/credential");

const findemailhelper = {};

findemailhelper.getCredentialsByEmail = async function (email) {
  try {
    const candidate = await CandidateModel.findOne({ email: email });
    const user = await User.findOne({ email: email });
    if (candidate || user) {
      return true;
    }
  } catch (error) {
    console.log("Error in retrieving user by email:", error);
    throw error;
  }
};

module.exports = findemailhelper;
