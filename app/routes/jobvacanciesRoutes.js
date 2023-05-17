const express = require("express");
const router = express.Router();
const jobvacanciesController = require("../controllers/recruitmentController");

router.post("/vacancies", jobvacanciesController.vacancies);
router.post("/recruiter", jobvacanciesController.recruitermodal);
module.exports = router;
