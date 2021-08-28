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
router.post("/", checkAuth, restrictTo("admin"), createSkillTest);
router.patch("/:tid", checkAuth, restrictTo("admin"), updateSkillTest);
router.delete("/:tid", checkAuth, restrictTo("admin"), deleteSkillTest);

// export
export const skillTestRoutes = router;
