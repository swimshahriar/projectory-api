import express from "express";
const router = express.Router();

// controllers
import {
  registerHandler,
  loginHandler,
  forgotPassword,
  resetPassword,
  isAuth,
  changePassword,
} from "../controller/authController.js";
import { getUserInfo, updateUserInfo } from "../controller/userController.js";

// routes
router.patch("/", isAuth, updateUserInfo);
router.get("/:uid", getUserInfo);

// auth
router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.patch("/change-password", isAuth, changePassword);

// export
export const userRoutes = router;
