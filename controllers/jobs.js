const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  console.log("fuction called");
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  console.log(jobs);
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};
const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });
  console.log("job", job);
  if (!job) {
    throw new NotFoundError("No job with your provided id");
  }
  res.status(StatusCodes.OK).json({ job });
};
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  console.log(req.body);
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json(job);
};
const updateJob = async (req, res) => {
  const {
    body: { comapny, position },
    user: { userId },
    params: { id: jobId },
  } = req;

  if (comapny === "" || position === "") {
    throw new BadRequestError("Company or Position fields cannot be empty");
  }

  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new NotFoundError("No job with your provided id");
  }
  res.status(StatusCodes.OK).json({ job });
};
const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findByIdAndDelete({
    _id: jobId,
    createdBy: userId,
  });
  console.log("job", job);
  if (!job) {
    throw new NotFoundError("No job with your provided id");
  }
  res.status(StatusCodes.OK).json({ job });
  res.send("delete all jobs");
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
