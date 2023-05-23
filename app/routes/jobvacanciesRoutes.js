const express = require("express");
const router = express.Router();
const jobvacanciesController = require("../controllers/recruitmentController");

router.post("/vacancies", jobvacanciesController.vacancies);
router.get("/recdata", jobvacanciesController.vacancieDetails);
router.get("/jobemail", jobvacanciesController.employeeDetail);
module.exports = router;
