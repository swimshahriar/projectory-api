import { Router } from "express";

// internal imports
import { createOrder } from "../controller/ordersController.js";
import { checkAuth } from "../middleware/checkAuth.js";
import { ordersValidateRules } from "../middleware/validators/ordersValidator.js";
import { validate } from "../middleware/validators/validateResult.js";

const router = Router();

// routes
router.post("/", ordersValidateRules(), validate, checkAuth, createOrder);

// exports
export const ordersRoutes = router;
