
const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");

router.post("/candidates", candidateController.candidates);
router.patch("/update/:id", candidateController.updated);
router.get("/checkedmail/:email", candidateController.getCandidateEmail);
router.get("/checkedmobile/:mobile", candidateController.getCandidateMobile);
router.get("/findcandidate",candidateController.getCandidate);
module.exports = router;
