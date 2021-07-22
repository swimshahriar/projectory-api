import express from "express";
const router = express.Router();

// controllers
import {
  getServices,
  createServices,
  updateServices,
  deleteService,
} from "../controller/servicesController.js";
import {
  getFavoriteServices,
  addFavoriteService,
} from "../controller/favoriteServicesController.js";
// middlewares
import { checkAuth } from "../middleware/checkAuth.js";

// routes
router.get("/", getServices);
router.post("/", checkAuth, createServices);
router.patch("/:sid", checkAuth, updateServices);
router.delete("/:sid", checkAuth, deleteService);
// favorites
router.get("/favorites", checkAuth, getFavoriteServices);
router.post("/favorites/:sid", checkAuth, addFavoriteService);

// export
export const servicesRoutes = router;
