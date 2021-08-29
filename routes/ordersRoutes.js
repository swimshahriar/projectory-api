import { Router } from "express";

// internal imports
import { createOrder, getOrders } from "../controller/ordersController.js";
import { checkAuth } from "../middleware/checkAuth.js";
import { ordersValidateRules } from "../middleware/validators/ordersValidator.js";
import { validate } from "../middleware/validators/validateResult.js";

const router = Router();

// routes
router.post("/", ordersValidateRules(), validate, checkAuth, createOrder);
router.get("/", checkAuth, getOrders);

// exports
export const ordersRoutes = router;
