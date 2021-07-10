import express from "express";
const router = express.Router();

// controllers
import { getRatingReviews } from "../controller/ratingReviewsController.js";

// middlewares
import { checkAuth } from "../middleware/checkAuth.js";

// rotues
router.get("/", checkAuth, getRatingReviews);

// exports
export const ratingReviewsRoutes = router;
