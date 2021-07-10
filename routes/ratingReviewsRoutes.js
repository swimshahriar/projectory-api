import express from "express";
const router = express.Router();

// controllers
import {
  createRatingReviews,
  getRatingReviews,
} from "../controller/ratingReviewsController.js";

// middlewares
import { checkAuth } from "../middleware/checkAuth.js";

// rotues
router.get("/", checkAuth, getRatingReviews);
router.post("/:sid", checkAuth, createRatingReviews);

// exports
export const ratingReviewsRoutes = router;
