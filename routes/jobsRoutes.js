import { Router } from "express";

// internal imports
import { checkAuth } from "../middleware/checkAuth.js";
import {
  createJob,
  getJobs,
  deleteJobs,
} from "../controller/jobsController.js";

const router = Router();

// routes
router.post("/", checkAuth, createJob);
router.get("/", getJobs);
router.delete("/:jid", checkAuth, deleteJobs);

// export
export const jobsRoutes = router;
