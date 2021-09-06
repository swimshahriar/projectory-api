import crypto from "crypto";
// internal imports
import catchAsync from "../utils/catchAsync.js";
import { Payments } from "../model/paymentsModel.js";
import AppError from "../utils/appError.js";

// --------------------- topup -------------------
export const topup = catchAsync(async (req, res, next) => {
  const { _id: userId, userName } = req.user;
  const { method, amount } = req.body;

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

// --------------------- update payment status --------------------
export const updatePaymentStatus = catchAsync(async (req, res, next) => {
  const { pid } = req.params;
  const { status } = req.params;

  // check if payment exist
  const payment = await Payments.findById(pid);
  if (!payment) {
    return next(new AppError("No payment found with this id.", 404));
  }

  // if payment in succeed or failed state
  if (payment.status === "succeed" || payment.status === "failed") {
    return next(new AppError("Cannot change status of the payment.", 400));
  }

  // update
  const payments = await Payments.findByIdAndUpdate(
    pid,
    { status },
    { new: true }
  );

  return res.status(200).json({
    status: "success",
    payments,
  });
});

// ------------------------ delete payment ------------------------
export const deletePayment = catchAsync(async (req, res, next) => {
  const { pid } = req.params;

  // check if payment exist
  const payment = await Payments.findById(pid);
  if (!payment) {
    return next(new AppError("No payment found with this id.", 404));
  }

  // delete
  await Payments.findByIdAndDelete(pid);

  return res.status(200).json({
    status: "success",
  });
});
