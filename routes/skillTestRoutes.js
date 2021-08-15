import { Router } from "express";

// internal imports
import {
  getSkillTests,
  createSkillTest,
  updateSkillTest,
  deleteSkillTest,
} from "../controller/skillTestController.js";
import { checkAuth } from "../middleware/checkAuth.js";
import { restrictTo } from "../middleware/restrictTo.js";

const router = Router();

// routes
router.get("/", checkAuth, getSkillTests);
router.post("/", checkAuth, restrictTo("user"), createSkillTest);
router.patch("/:tid", checkAuth, restrictTo("user"), updateSkillTest);
router.delete("/:tid", checkAuth, restrictTo("user"), deleteSkillTest);

// export
export const skillTestRoutes = router;
