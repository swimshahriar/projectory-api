import mongoose from "mongoose";

const servicesSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title required."] },
    images: {
      type: Array,

      required: [true, "An image is required."],
    },
    about: {
      type: String,

      required: [true, "About this gig is required."],
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
      required: [true, "User img is required."],
    },
    category: {
      type: String,
      enum: [
        "web-developement",
        "mobile-developement",
        "graphics-designing",
        "seo",
        "digital-marketing",
      ],
      required: [true, "Category is required."],
    },
    rating: {
      type: Object,
      default: undefined,
      rating: Number,
      count: Number,
    },
    packages: [
      {
        name: {
          type: String,
          enum: ["Basic", "Standard", "Premium"],
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        deliveryTime: {
          type: Number,

          required: true,
        },
        features: {
          type: Array,

          required: true,
        },
      },
    ],
    favorites: {
      type: Array,
      default: undefined,
    },
  },
  { timestamps: true }
);

// creating index
servicesSchema.index({ title: "text" });

// export
export const Services = mongoose.model("Service", servicesSchema);
