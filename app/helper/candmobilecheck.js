const CandidateModel = require("../models/candidate");

const findemailhelper = {};

findemailhelper.getCredentialsByEmail = async function (mobile) {
  try {
    const user = await CandidateModel.findOne({ mobile: mobile });
    return user;
  } catch (error) {
    console.log("Error in retrieving user by mobile:", error);
    throw error;
  }
};

module.exports = findemailhelper;
