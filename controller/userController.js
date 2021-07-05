import { User } from "../model/userModel.js";

// error handler
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

import { isAuth } from "./authController.js";

// user info
export const getUserInfo = catchAsync(async (req, res, next) => {
  const { uid } = req.params;

  if (!uid) {
    return next(new AppError("Please provide user id!", 400));
  }

  const user = await User.findById(uid);

  if (!user) {
    return next(new AppError("Incorrect user id!", 401));
  }

  return res.status(200).json({
    status: "success",
    user,
  });
});

// update user info
export const updateUserInfo = catchAsync(async (req, res, next) => {
  const { _id: uid } = req.user;

  const oldUserData = await User.findById(uid);

  const newUserData = await User.findOneAndUpdate(
    { _id: uid },
    { ...oldUserData._doc, ...req.body },
    { new: true, runValidators: true, context: "query" }
  );

  res.status(200).json({
    status: "success",
    user: newUserData,
  });
});
