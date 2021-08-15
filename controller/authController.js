import { promisify } from "util";
import crypto from "crypto";
import jwt from "jsonwebtoken";

// catch async handler
import catchAsync from "../utils/catchAsync.js";

// user model
import { User } from "../model/userModel.js";

import AppError from "../utils/appError.js";
import { sendEmail } from "../utils/email.js";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// helper functions
const decodeToken = (token) => {
  return jwt.decode(token, process.env.JWT_SECRET);
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const { exp } = decodeToken(token);

  return res.status(statusCode).json({
    status: "success",
    uid: user._id,
    token,
    expiresAt: exp,
  });
};

// register
export const registerHandler = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    userName: req.body.userName,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    role: req.body.role,
  });

  createSendToken(newUser, 201, res);
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

  createSendToken(user, 200, res);
});

// forgot password - token create and send email
export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is no user with this email address.", 404));
  }

  // get reset token and save it in db
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONT_END_URL}/reset-password/${resetToken}`;

  const message = `Forgot your password? Click on the link to reset your password: ${resetUrl}.\nIf you did't forgot your password, please ignore this email!\nLink is valid for only 10min.`;
  // send mail to the user
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    return res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

// reset password
export const resetPassword = catchAsync(async (req, res, next) => {
  // getting user form token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // if user exist change password
  if (!user) {
    return next(new AppError("Token is invalid or has expired.", 400));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save({ validateBeforeSave: true });

  // success response
  return res.status(200).json({
    status: "success",
    message: "Password changed, please try to login!",
  });
});

// change password
export const changePassword = catchAsync(async (req, res, next) => {
  // check user from db
  const user = await User.findById(req.user.id).select("+password");

  // if current pass is correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError("Your current password is wrong"));
  }

  // update pass
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  // sign token and send it
  createSendToken(user, 200, res);
});
