import { Router } from "express";
// internal imports
import {
  paymentsUpdateRules,
  paymentsValidateRules,
} from "../middleware/validators/paymentsValidator.js";
import { validate } from "../middleware/validators/validateResult.js";
import { checkAuth } from "../middleware/checkAuth.js";
import {
  deletePayment,
  topup,
  updatePaymentStatus,
} from "../controller/paymentsController.js";

const router = Router();

// routes
router.post("/", paymentsValidateRules(), validate, checkAuth, topup);
router.patch("/:pid", paymentsUpdateRules(), validate, updatePaymentStatus);
router.delete("/:pid", deletePayment);

// exports
export const paymentsRoutes = router;
