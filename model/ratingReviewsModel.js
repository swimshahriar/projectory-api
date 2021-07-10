import mongoose from "mongoose";

const ratingReviewsSchema = new mongoose.Schema(
  {
    star: {
      type: Number,
      enum: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
      required: [true, "Star is required."],
    },
    review: {
      type: String,
      maxlength: 100,
      default: undefined,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User id is required."],
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Service id is required."],
    },
  },
  { timestamps: true }
);

// export
export const Ratings = mongoose.model("Rating", ratingReviewsSchema);
