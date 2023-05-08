// const { UserModel } = require("../models/credential");
const { User } = require("../models/credential");

require("dotenv").config();
const jwt = require("jsonwebtoken");

const google = async (req, res) => {
  try {
    if (userProfile) {
      console.log("userProfile.id", userProfile.id);
      const user = await User.findOne({ email: userProfile.email });
      console.log(user);
      if (user) {
        const token = jwt.sign(
          { email: user.email },
          process.env.JWT_TOKEN_KEY
        );
        console.log(token);
        return { token };
      } else {
        return "email doen not exist";
      }
    }
  } catch (error) {
    console.log("error", error);
  }
};

module.exports = { google };
