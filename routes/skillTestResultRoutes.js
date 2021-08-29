import { Router } from "express";

// internal imports
import {
  getSkillTestResults,
  giveSkillTest,
  deleteSkillTestResult,
} from "../controller/skillTestResultController.js";
import { checkAuth } from "../middleware/checkAuth.js";
import { restrictTo } from "../middleware/restrictTo.js";
import { giveSkillTestValidateRules } from "../middleware/validators/skillTestResultValidator.js";
import { validate } from "../middleware/validators/validateResult.js";

const router = Router();

// routes
router.get("/", checkAuth, getSkillTestResults);
router.post(
  "/:tid",
  checkAuth,
  restrictTo("user"),
  giveSkillTestValidateRules(),
  validate,
  giveSkillTest
);
router.delete("/:trid", checkAuth, restrictTo("admin"), deleteSkillTestResult);

// export
export const skillTestResultRoutes = router;
