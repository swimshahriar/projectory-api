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
import { ratingValidateRules } from "../middleware/validators/ratingValidator.js";
import { validate } from "../middleware/validators/validateResult.js";

// rotues
router.get("/", getRatingReviews);
router.post(
  "/:sid",
  ratingValidateRules(),
  validate,
  checkAuth,
  createRatingReviews
);
router.delete("/:rid", checkAuth, deleteRatingReviews);

// exports
export const ratingReviewsRoutes = router;
