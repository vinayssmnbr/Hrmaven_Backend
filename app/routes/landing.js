const express = require('express');
const router = express.Router();
const authentication = require('../middlewares/authentication');
const landing = require('../controllers/landing');

router.post('/login',authentication.verify,landing.login);
router.post('/signup',authentication.verify,landing.signup);
router.get('',(req,res)=>{
    res.send("landing page here!!!");
})

module.exports = router;