import { promisify } from "util";
import jwt from "jsonwebtoken";

// model
import { User } from "../model/userModel.js";

// error handler
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const checkAuth = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in. Please login to access.", 401)
    );
  }

  // token verify
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // is user still exist
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError("The user belonging to this token does not exist.", 401)
    );
  }

  // if user changed password
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please login again.", 401)
    );
  }

  // authenticated
  req.user = freshUser;
  next();
});
