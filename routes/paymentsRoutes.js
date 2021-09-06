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
import { restrictTo } from "../middleware/restrictTo.js";

const router = Router();

// routes
router.post("/", paymentsValidateRules(), validate, checkAuth, topup);
router.patch(
  "/:pid",
  paymentsUpdateRules(),
  validate,
  checkAuth,
  restrictTo(["admin"]),
  updatePaymentStatus
);
router.delete("/:pid", checkAuth, restrictTo(["admin"]), deletePayment);

// exports
export const paymentsRoutes = router;
