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
    userImg: userImg || undefined,
    userName,
  });

  return res.status(201).json({ status: "success", jobs });
});

// get jobs
export const getJobs = CatchAsync(async (req, res, next) => {
  const { uid, status, jid, cat, search } = req.query;

  let jobs;

  if (uid && !status) {
    jobs = await Jobs.find({ userId: uid }).sort("-createdAt");
  } else if (status && !uid) {
    jobs = await Jobs.find({ status }).sort("-createdAt");
  } else if (uid && status) {
    jobs = await Jobs.find({ userId: uid, status }).sort("-createdAt");
  } else if (jid) {
    jobs = await Jobs.find({ _id: jid }).sort("-createdAt");
  } else if (cat && !search) {
    jobs = await Jobs.find({ category: cat })
      .where("status")
      .equals("public")
      .sort("-createdAt");
  } else if (!cat && search) {
    jobs = await Jobs.find({
      $and: [
        {
          $text: {
            $search: search,
          },
        },
        {
          status: "public",
        },
      ],
    }).sort("-createdAt");
  } else if (cat && search) {
    jobs = await Jobs.find({
      $and: [
        {
          $text: {
            $search: search,
          },
        },
        {
          category: cat,
        },
        {
          status: "public",
        },
      ],
    }).sort("-createdAt");
  } else {
    jobs = await Jobs.find({ status: "public" }).sort("-createdAt");
  }

  return res
    .status(200)
    .json({ status: "success", length: jobs.length || 0, jobs });
});

// delete jobs
export const deleteJobs = CatchAsync(async (req, res, next) => {
  const { _id: userId } = req.user;
  const { jid } = req.params;

  const job = await Jobs.findById(jid);

  if (!job || job?.length <= 0) {
    return next(new AppError("No job found with this id.", 404));
  }

  if (job.userId.toString() !== userId.toString()) {
    return next(new AppError("Not authorized.", 401));
  }

  if (job.status !== "public") {
    return next(new AppError("Job is not in public status.", 400));
  }

  await Jobs.findOneAndDelete({ _id: jid });

  return res.status(200).json({ status: "success" });
});

// update job
export const updateJob = CatchAsync(async (req, res, next) => {
  const { _id: userId } = req.user;
  const { jid } = req.params;

  const job = await Jobs.findById(jid);

  if (!job) {
    return next(new AppError("No job found with this id.", 404));
  }

  if (
    userId.toString() !== job.userId.toString() &&
    req.user.role !== "admin"
  ) {
    return next(new AppError("You are not authorized.", 401));
  }

  // if req.body is empty
  if (!Object.keys(req.body).length) {
    return next(new AppError("Req body cannot be empty.", 400));
  }

  const updatedJob = await Jobs.findOneAndUpdate(
    { _id: jid },
    { ...req.body },
    { new: true }
  );

  return res.status(200).json({ status: "success", jobs: [updatedJob] });
});
