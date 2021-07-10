import express from "express";
const router = express.Router();

// controllers
import {
  getServices,
  createServices,
  updateServices,
} from "../controller/servicesController.js";
import { isAuth } from "../controller/authController.js";

// routes
router.get("/", getServices);
router.post("/", isAuth, createServices);
router.patch("/:sid", isAuth, updateServices);

// export
export const servicesRoutes = router;
