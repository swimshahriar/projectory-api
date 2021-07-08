import express from "express";
const router = express.Router();

// controllers
import {
  getServices,
  createServices,
} from "../controller/servicesController.js";
import { isAuth } from "../controller/authController.js";

// routes
router.get("/", getServices);
router.post("/", isAuth, createServices);

// export
export const servicesRoutes = router;
