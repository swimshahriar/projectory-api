import crypto from "crypto";
// internal imports
import catchAsync from "../utils/catchAsync.js";
import { Payments } from "../model/paymentsModel.js";

// --------------------- topup -------------------
export const topup = catchAsync(async (req, res, next) => {
  const { _id: userId, userName } = req.user;

  const id = crypto.randomBytes(3).toString("hex");

  // create payment
  const payments = new Payments({
    userId,
    userName,
    id,
    ...req.body,
  });
  await payments.save();

  return res.status(201).json({
    status: "success",
    payments,
  });
});
