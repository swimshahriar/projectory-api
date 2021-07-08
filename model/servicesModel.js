import mongoose, { Mongoose } from "mongoose";
import validator from "validator";

const servicesSchema = new mongoose.Schema({
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
  ratings: [
    {
      star: {
        type: Number,
        max: [5, "star cannot be greater than 5."],
      },
      uid: Object,
      review: {
        type: String,
        maxlength: 100,
      },
      createdAt: Date.now(),
    },
  ],
  packages: [
    {
      name: {
        type: String,
        enum: ["Basic", "Standard", "Premium"],
        required: true,
        lowercase: true,
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
});

// export
export const Services = mongoose.model("Service", servicesSchema);
