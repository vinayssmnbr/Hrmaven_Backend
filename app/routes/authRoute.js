const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");
require("../middlewares/passport");

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

 
console.log("passport", passport);
router.get("/google/callback", passport.authenticate('google'), authController.googleController);


module.exports = router;