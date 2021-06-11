import express from "express";
const router = express.Router();

// controllers
import {
  registerHandler,
  loginHandler,
  forgotPassword,
  resetPassword,
} from "../controller/authController.js";

// routes
// auth
router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

// export
export const userRoutes = router;
