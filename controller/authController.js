import { promisify } from "util";
import jwt from "jsonwebtoken";

// catch async handler
import catchAsync from "../utils/catchAsync.js";

// user model
import { User } from "../model/userModel.js";

import AppError from "../utils/appError.js";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const decodeToken = (token) => {
  return jwt.decode(token, process.env.JWT_SECRET);
};

// register
export const registerHandler = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  const token = signToken(newUser._id);
  const { exp } = decodeToken(token);

  return res.status(201).json({
    status: "success",
    token,
    expiresAt: exp,
    data: { user: newUser },
  });
});

// login
export const loginHandler = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // is email and password available
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  // is user exist and is pass correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = signToken(user._id);
  const { exp } = decodeToken(token);

  return res.status(200).json({
    status: "success",
    token,
    expiresAt: exp,
  });
});

// check for authentication
export const isAuth = catchAsync(async (req, res, next) => {
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
  const freshUser = User.findById(decoded.id);
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

// restrict by role - authorization
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new App("You do not have permission to perform this action.", 403)
      );
    }

    next();
  };
};
