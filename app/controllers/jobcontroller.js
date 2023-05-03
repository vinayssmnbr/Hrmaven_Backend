const Job = require('../models/Job');

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    console.log('Jobs retrieved successfully:', jobs);
    res.send(jobs);
  } catch (error) {
    console.error('Error retrieving jobs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};


const getJobById = async (req, res) => {
    const jobId = req.params.id;
    try {
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json(job);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving job' });
    }
};

const createJob = async (req, res) => {
    const jobData = req.body;
    try {
      const job = await Job.create(jobData);
      res.status(201).json(job);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error creating job', details: error.message });
    }
  };

const updateJob = async (req, res) => {
    const jobId = req.params.id;
    const jobData = req.body;
    try {
        const job = await Job.findByIdAndUpdate(jobId, jobData, { new: true });
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json(job);
    } catch (error) {
        res.status(500).json({ error: 'Error updating job' });
    }
};

const deleteJob = async (req, res) => {
    const jobId = req.params.id;
    try {
        const job = await Job.findByIdAndDelete(jobId);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting job' });
    }
};

module.exports = {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
};