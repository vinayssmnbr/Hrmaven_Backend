
const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");

router.post("/candidates", candidateController.candidates);
module.exports = router;
