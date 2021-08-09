import { Router } from "express";

// internal imports
import { checkAuth } from "../middleware/checkAuth.js";
import { createJob, getJobs } from "../controller/jobsController.js";

const router = Router();

// routes
router.post("/", checkAuth, createJob);
router.get("/", getJobs);

// export
export const jobsRoutes = router;
