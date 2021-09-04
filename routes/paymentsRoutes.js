import { Router } from "express";
// internal imports
import { paymentsValidateRules } from "../middleware/validators/paymentsValidator.js";
import { validate } from "../middleware/validators/validateResult.js";
import { checkAuth } from "../middleware/checkAuth.js";
import { topup } from "../controller/paymentsController.js";

const router = Router();

// routes
router.post("/", paymentsValidateRules(), validate, checkAuth, topup);

// exports
export const paymentsRoutes = router;
