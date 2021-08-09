import { Router } from "express";

// internal imports
import { checkAuth } from "../middleware/checkAuth.js";
import { createJob } from "../controller/jobsController.js";

const router = Router();

// routes
router.post("/", checkAuth, createJob);
