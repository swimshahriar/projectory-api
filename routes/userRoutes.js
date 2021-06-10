import express from "express";
const router = express.Router();

// controllers
import { registerHandler, loginHandler } from "../controller/authController.js";

// routes
// auth
router.post("/register", registerHandler);
router.post("/login", loginHandler);

// export
export const userRoutes = router;
