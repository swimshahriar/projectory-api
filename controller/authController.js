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

  return res.status(201).json({
    status: "success",
    token,
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

  return res.status(200).json({
    status: "success",
    token,
  });
});
