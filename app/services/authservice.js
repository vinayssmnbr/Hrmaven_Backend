const UserModel = require("../models/credential");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const google = async (req, res) => {
  try {
    if (userProfile) {
      console.log("userProfile.id", userProfile.id);
      const user = await UserModel.findOne({ email: userProfile.email });
      if (user) {
        const token = jwt.sign(
          { email: user.email },
          process.env.JWT_TOKEN_KEY
        );

        return { token };
      } else {
        const newuser = new UserModel({
          username: userProfile.displayName,
          email: userProfile.emails[0].value,
          googleID: userProfile.id,
        });
        const userRegister = await newuser.save();
        var token = jwt.sign(
          { email: userRegister.email },
          process.env.JWT_TOKEN_KEY,
          {}
        );
        return { token };
      }
    }
  } catch (error) {
    console.log("error", error);
  }
};

module.exports = { google };
