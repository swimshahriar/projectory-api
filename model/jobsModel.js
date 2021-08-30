import mongoose from "mongoose";

const jobsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxlength: 100,
      required: [true, "Title required."],
    },
    details: {
      type: String,
      maxlength: 500,
      required: [true, "Details is required."],
    },
    price: {
      type: Number,
      required: [true, "Price is required."],
    },
    duration: {
      type: Number,
      required: [true, "Duration is required."],
    },
    category: {
      type: String,
      enum: [
        "web-development",
        "mobile-development",
        "graphics-designing",
        "seo",
        "digital-marketing",
      ],
      required: [true, "Category is required."],
    },
    status: {
      type: String,
      default: "public",
      enum: ["public", "active", "finished", "canceled"],
    },
    skills: {
      type: Array,
      required: [true, "Atleast one skill is required."],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User id is required."],
    },
    userName: {
      type: String,
      required: [true, "User name is required."],
    },
    userImg: {
      type: String,
    },
    applicants: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// export
export const Jobs = mongoose.model("Job", jobsSchema);
