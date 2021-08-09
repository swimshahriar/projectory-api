// internal imports
import CatchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { Jobs } from "../model/jobsModel.js";

// create job
export const createJob = CatchAsync(async (req, res, next) => {
  const { _id: userId, avatar: userImg, userName } = req.user;

  const jobs = await Jobs.create({
    ...req.body,
    userId,
    userImg,
    userName,
  });

  return res.status(201).json({ status: "success", jobs });
});

// get jobs
export const getJobs = CatchAsync(async (req, res, next) => {
  const { uid, status } = req.params;

  let jobs;

  if (uid && !status) {
    jobs = await Jobs.find({ userId: uid }).sort("-createdAt");
  } else if (status && !uid) {
    jobs = await Jobs.find({ status }).sort("-createdAt");
  } else if (uid && status) {
    jobs = await Jobs.find({ userId: uid, status }).sort("-createdAt");
  } else {
    jobs = await Jobs.find().sort("-createdAt");
  }

  return res
    .status(200)
    .json({ status: "success", length: jobs.length || 0, jobs });
});
