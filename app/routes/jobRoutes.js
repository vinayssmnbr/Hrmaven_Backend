const express = require('express');
const jobController = require('../controllers/jobcontroller');

const router = express.Router();

// GET /api/jobs
router.get('/', jobController.getAllJobs);
// GET /api/jobs/:id
router.get('/jobs/:id', jobController.getJobById);
// POST /api/jobs
router.post('/jobs', jobController.createJob);
// PUT /api/jobs/:id
router.put('/jobs/:id', jobController.updateJob);
// DELETE /api/jobs/:id
router.delete('/jobs/:id', jobController.deleteJob);
module.exports = router;