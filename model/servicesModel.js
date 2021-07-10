import mongoose from "mongoose";

const servicesSchema = new mongoose.Schema(
  {
    title: { type: String, maxlength: 50, required: [true, "Title required."] },
    images: {
      type: Array,
      maxlength: 3,
      required: [true, "An image is required."],
    },
    about: {
      type: String,
      maxlength: 200,
      required: [true, "About this gig is required."],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User id is required."],
    },
    category: {
      type: String,
      enum: ["web-developement", "mobile-developement", "graphics-designing"],
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
          max: 30,
          required: true,
        },
        features: {
          type: Array,
          maxlength: 7,
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

// export
export const Services = mongoose.model("Service", servicesSchema);
