import express from "express";
const router = express.Router();

// controllers
import { getServices } from "../controller/servicesController.js";

// routes
router.get("/", getServices);

// export
export const servicesRoutes = router;
