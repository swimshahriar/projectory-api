import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, "Order id required."],
      unique: true,
    },
    type: {
      type: String,
      required: [true, "Order type required."],
      enum: ["services", "jobs"],
    },
    serviceId: {
      type: mongoose.Types.ObjectId,
    },
    package: {
      type: String,
    },
    jobId: {
      type: mongoose.Types.ObjectId,
    },
    title: {
      type: String,
      required: [true, "Title is required."],
    },
    package: String,
    price: {
      type: Number,
      required: [true, "Price is required."],
    },
    duration: {
      type: Number,
      required: [true, "Duration is required."],
    },
    features: {
      type: Array,
      required: [true, "Features required."],
    },
    reqPersonId: {
      type: mongoose.Types.ObjectId,
      required: [true, "Request Person Id required."],
    },
    reqPersonUserName: {
      type: String,
      required: [true, "Request Person Username required."],
    },
    reqPersonFinished: {
      type: Boolean,
      default: false,
    },
    recPersonId: {
      type: mongoose.Types.ObjectId,
      required: [true, "Receiver Person Id required."],
    },
    recPersonUserName: {
      type: String,
      required: [true, "Receiver Person Username required."],
    },
    recPersonGot: {
      type: Number,
    },
    status: {
      type: String,
      required: [true, "Status is required."],
      enum: ["requested", "active", "finished", "canceled"],
      default: "requested",
    },
    activeDate: {
      type: Date,
    },
    finishedDate: {
      type: Date,
    },
    canceledDate: {
      type: Date,
    },
    brief: {
      type: String,
      required: [true, "Brief is required."],
    },
    sellerMoney: Number,
  },
  { timestamps: true }
);

// export
export const Orders = mongoose.model("Order", orderSchema);
