import mongoose from "mongoose";

// schema
const paymentsSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, "Id is required."],
    },
    amount: {
      type: Number,
      required: [true, "amount is required"],
    },
    paymentType: {
      type: String,
      enum: ["topup", "withdraw"],
      required: [true, "payment type is required."],
    },
    method: {
      type: String,
      required: [true, "payment method is required."],
      enum: ["stripe", "bkash", "nagad"],
    },
    phoneNumber: {
      type: Number,
    },
    transactionId: {
      type: String,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: [true, "user id is required."],
    },
    userName: {
      type: String,
      required: [true, "User id required."],
    },
    status: {
      type: String,
      enum: ["pending", "succeed", "failed"],
      required: [true, "status is required."],
      default: "pending",
    },
  },
  { timestamps: true }
);

// export
export const Payments = mongoose.model("Payment", paymentsSchema);
