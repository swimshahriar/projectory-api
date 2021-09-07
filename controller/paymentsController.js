import crypto from "crypto";
// internal imports
import catchAsync from "../utils/catchAsync.js";
import { Payments } from "../model/paymentsModel.js";
import AppError from "../utils/appError.js";
import { User } from "../model/userModel.js";

// --------------------- get payments -------------------
export const getPayments = catchAsync(async (req, res, next) => {
  const { uid, pid, type } = req.query;

  let payments;
  if (pid) {
    payments = await Payments.findById(pid);
  } else if (type === "topup" && uid) {
    payments = await Payments.find({ userId: uid, paymentType: "topup" }).sort(
      "-updatedAt"
    );
  } else if (type === "withdraw" && uid) {
    payments = await Payments.find({
      userId: uid,
      paymentType: "withdraw",
    }).sort("-updatedAt");
  } else if (type && !uid) {
    payments = await Payments.find({ paymentType: type }).sort("-updatedAt");
  } else {
    return next(new AppError("Bad request", 400));
  }

  return res.status(200).json({
    status: "success",
    payments,
  });
});

// --------------------- topup/withdraw -------------------
export const topup = catchAsync(async (req, res, next) => {
  const { _id: userId, userName, balance } = req.user;
  const { method, amount, paymentType } = req.body;

  // check if have balance
  if (paymentType === "withdraw" && balance < amount) {
    return next(new AppError("You do not have enough balance.", 400));
  }

  const id = crypto.randomBytes(3).toString("hex");

  // create payment
  const payments = new Payments({
    userId,
    userName,
    id,
    ...req.body,
  });
  await payments.save();

  if (paymentType === "withdraw") {
    // fetch user and admin data
    const userInfo = await User.findById(userId);
    const adminInfo = await User.findOne({ role: "admin" });

    // update admin and user balance
    await User.findByIdAndUpdate(userInfo._id, {
      balance: userInfo.balance - amount,
    });
    await User.findByIdAndUpdate(adminInfo._id, {
      balance: parseFloat(adminInfo.balance + parseFloat(amount)),
    });
  }

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

  // if type withdraw
  if (status === "succeed" && payment.paymentType === "withdraw") {
    const admin = await User.findOne({ role: "admin" });

    await User.findByIdAndUpdate(admin._id, {
      balance: parseFloat(admin.balance - payment.amount),
    });
  } else if (status === "failed" && payment.paymentType === "withdraw") {
    const admin = await User.findOne({ role: "admin" });
    await User.findByIdAndUpdate(admin._id, {
      balance: parseFloat(admin.balance - payment.amount),
    });

    const user = await User.findOne({ _id: payment.userId });
    await User.findByIdAndUpdate(user._id, {
      balance: parseFloat(user.balance + parseFloat(payment.amount)),
    });
  }

  // if type topup
  if (status === "succeed" && payment.paymentType === "topup") {
    const user = await User.findOne({ _id: payment.userId });

    await User.findByIdAndUpdate(user._id, {
      balance: parseFloat(user.balance + parseFloat(parpayment.amount)),
    });
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
