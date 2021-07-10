import express from "express";
const router = express.Router();

// controllers
import {
  createRatingReviews,
  deleteRatingReviews,
  getRatingReviews,
} from "../controller/ratingReviewsController.js";

// middlewares
import { checkAuth } from "../middleware/checkAuth.js";

// rotues
router.get("/", checkAuth, getRatingReviews);
router.post("/:sid", checkAuth, createRatingReviews);
router.delete("/:rid", checkAuth, deleteRatingReviews);

// exports
export const ratingReviewsRoutes = router;
