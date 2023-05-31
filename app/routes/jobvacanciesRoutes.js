const express = require("express");
const router = express.Router();
const jobvacanciesController = require("../controllers/recruitmentController");

router.post("/vacancies", jobvacanciesController.vacancies);
router.get("/recdata", jobvacanciesController.vacancieDetails);
router.get("/jobemail", jobvacanciesController.employeeDetail);
router.get("/fetchjob", jobvacanciesController.fetchjobVancancies);
router.post("/meeting", jobvacanciesController.meeting);
router.get("/activity", jobvacanciesController.activityfeed);
router.get("/app/analysis", jobvacanciesController.dynamicrecord);
module.exports = router;
