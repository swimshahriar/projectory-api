import crypto from "crypto";
// internal imports
import { Jobs } from "../model/jobsModel.js";
import { Orders } from "../model/ordersModel.js";
import { Services } from "../model/servicesModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

// --------------------- create order -----------------
export const createOrder = catchAsync(async (req, res, next) => {
  const { _id: uid, userName } = req.user;
  const { serviceId, jobId } = req.body;

  // check if service or job id is valid
  let isValidId;
  if (serviceId) {
    isValidId = await Services.findById(serviceId);
  } else if (jobId) {
    isValidId = await Jobs.findById(jobId);
  }

  if (!isValidId) {
    return next(new AppError("Service or Job id is not valid.", 400));
  }

  // generate order id
  const id = crypto.randomBytes(3).toString("hex");

  // create new order
  const orders = new Orders({
    ...req.body,
    id,
    reqPersonId: uid,
    reqPersonUserName: userName,
  });

  await orders.save();

  return res.status(201).json({
    status: "success",
    orders,
  });
});

// ----------------------- get orders --------------------
export const getOrders = catchAsync(async (req, res, next) => {
  const { oid, reqUid, recUid } = req.query;

  let orders;
  if (oid) {
    orders = await Orders.findById(oid);
  } else if (reqUid) {
    orders = await Orders.find({ reqPersonId: reqUid }).sort("-updatedAt");
  } else if (recUid) {
    orders = await Orders.find({ recPersonId: recUid }).sort("-updatedAt");
  } else {
    orders = await Orders.find().sort("-updatedAt");
  }

  return res.status(200).json({
    status: "success",
    orders,
  });
});

// ----------------------- update order --------------------
export const updateOrder = catchAsync(async (req, res, next) => {
  const { _id: uid, role } = req.user;
  const { oid } = req.params;

  // check if user is authorized
  const order = await Orders.findById(oid);
  if (
    order.reqPersonId !== uid &&
    order.recPersonId !== uid &&
    role !== "admin"
  ) {
    return next(new AppError("You are not authorized to change info.", 401));
  }

  // update orders
  const orders = await Orders.findByIdAndUpdate(
    oid,
    { ...req.body },
    { new: true }
  );

  return res.status(200).json({
    status: "success",
    orders,
  });
});

// ----------------------- delete order --------------------
export const deleteOrder = catchAsync(async (req, res, next) => {
  const { oid } = req.params;

  // check if order exist
  const isOrderExist = await Orders.findById(oid);
  if (!isOrderExist) {
    return next(new AppError("No order found with this id.", 404));
  }

  // delete order
  await Orders.findOneAndDelete({ _id: oid });

  return res.status(200).json({ status: "success" });
});
