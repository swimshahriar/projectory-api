import jwt from "jsonwebtoken";

// catch async handler
import catchAsync from "../utils/catchAsync.js";

// user model
import { User } from "../model/userModel.js";

// register
export const registerHandler = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  return res.status(201).json({
    status: "success",
    message: { user: newUser },
  });
});

// login
export const loginHandler = (req, res) => {
  res.json({
    message: "res from login route",
  });
};
