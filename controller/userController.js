import { User } from "../model/userModel.js";

// error handler
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

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
export const updateUserInfo = catchAsync(async (req, res, next) => {});
