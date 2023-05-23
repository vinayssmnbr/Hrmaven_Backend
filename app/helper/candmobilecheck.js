const CandidateModel = require("../models/candidate");

const findemailhelper = {};

findemailhelper.getCredentialsBymobile = async function (contactnumber) {
  try {
    const user = await CandidateModel.findOne({ contactnumber: contactnumber });
    return user;
  } catch (error) {
    console.log("Error in retrieving user by mobile:", error);
    throw error;
  }
};

module.exports = findemailhelper;
