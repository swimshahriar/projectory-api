import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// user model
import { User } from "../model/userModel.js";

// register
export const registerHandler = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  // checking, if user email already exists or not
  let existingEmail;
  try {
    existingEmail = await User.findOne({ email });
  } catch (error) {
    const err = new Error("Registration failed!");
    return next(err);
  }

  // if email exists, show error
  if (existingEmail) {
    const error = new Error("Email already exists!");
    return next(error);
  }

  // password hashing
  let hashedPass;
  try {
    hashedPass = await bcrypt.hash(password, 10);
  } catch (error) {
    const err = new Error("Registration failed!");
    return next(err);
  }
};

// login
export const loginHandler = (req, res) => {
  res.json({
    message: "res from login route",
  });
};
