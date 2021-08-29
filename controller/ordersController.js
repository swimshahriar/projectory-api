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
