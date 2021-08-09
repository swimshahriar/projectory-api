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

  return res.status(200).json({ status: "success", jobs });
});
