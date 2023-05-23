const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");

router.post("/candidates", candidateController.candidates);
router.patch("/status/jobupdate/:id", candidateController.updated);
router.get("/checkedmail/:email", candidateController.getCandidateEmail);
router.get("/checkedmobile/:contactnumber", candidateController.getCandidateMobile);
router.get("/findcandidate",candidateController.getCandidate);
router.get("/candiduid", candidateController.generatecanUid);
module.exports = router;
