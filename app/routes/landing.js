const express = require('express');
const router = express.Router();
const verify = require('../middlewares/authentication');
const landing = require('../controllers/landing');

router.get('/auth',verify,landing.auth);
// router.post('/login',authentication.verify,landing.login);
router.post('/login',landing.login);

router.post('/signup',landing.signup);
router.get('',(req,res)=>{
    res.send("landing page here!!!");
})

module.exports = router;