import express from "express";
const router = express.Router();

// controllers
import { registerHandler, loginHandler } from "../controller/authController.js";

// routes
// register
router.post("/register", registerHandler);

// login
router.post("/login", loginHandler);

// export
export const authRoutes = router;
