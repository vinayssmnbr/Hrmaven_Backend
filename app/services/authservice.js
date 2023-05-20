// const { UserModel } = require("../models/credential");
const { User } = require("../models/credential");

require("dotenv").config();
const jwt = require("jsonwebtoken");

const google = async (req, res) => {
  try {
    if (userProfile) {
      const user = await User.findOne({ email: userProfile.email });
      if (user) {
        const token = jwt.sign(
          { email: user.email },
          process.env.JWT_TOKEN_KEY
        );

        return { token,user};
      } else {
        return "email doen not exist";
      }
    }
  } catch (error) {
  }
};

module.exports = { google };
