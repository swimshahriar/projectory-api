import express from "express";
const router = express.Router();

// controllers
import {
  getServices,
  createServices,
  updateServices,
  deleteService,
} from "../controller/servicesController.js";
import { isAuth } from "../controller/authController.js";

// routes
router.get("/", getServices);
router.post("/", isAuth, createServices);
router.patch("/:sid", isAuth, updateServices);
router.delete("/:sid", isAuth, deleteService);

// export
export const servicesRoutes = router;
