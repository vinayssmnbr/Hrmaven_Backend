const express = require("express");
const router = express.Router();
const verify = require("../middlewares/authentication");
const landing = require("../controllers/landing");

router.get("/auth", verify.verify, landing.auth);
// router.post('/login',authentication.verify,landing.login);
router.post("/login", landing.login);

router.post("/signup", landing.signup);
router.post("/forgotpassword", landing.forgot);
router.post("/resetpassword", landing.reset);

module.exports = router;
