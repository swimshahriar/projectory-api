import express from "express";
const router = express.Router();

// controllers
import {
  registerHandler,
  loginHandler,
  forgotPassword,
} from "../controller/authController.js";

// routes
// auth
router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.post("/forgot-password", forgotPassword);

// export
export const userRoutes = router;
