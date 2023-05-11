const express = require("express");
const router = express.Router();
const verify = require("../middlewares/authentication");
const landing = require("../controllers/landing");
const emplanding = require('../controllers/empController')
const helper = require('../helper/helper')

router.get("/auth", verify.verify, landing.auth);
// router.post('/login',authentication.verify,landing.login);
router.post('/login',landing.login);
router.post('/login/emp',landing.loginemp);
router.get('/user-profile',landing.getUserProfile);


router.post('/signup', landing.signup);
router.post('/forgotpassword', landing.forgot);

router.post('/resetpassword',landing.reset);
router.post('/resetpasswordemp', landing.resetemp);

// router.get('/resetpassword',landing.reset);
router.post('/pwdmgt/:email', landing.getUserProfilepwd);

router.post('/resetpasswordaccount/:email',landing.resett);

router.get('/userprofilepwd', landing.getUserProfilepwd)
router.post('/addpersonaldata',landing.addpersonals);
router.patch('/updatepersonal/:email', landing.updatehrUser);
router.put('/putpersonal/:email', landing.putdatacompany);

router.get('/getpersonalsdata/:email', landing.getpersonalsdata)
// router.post("/reset", verify.tokenParser, landing.checkreset);



module.exports = router;
