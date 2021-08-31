import crypto from "crypto";
// internal imports
import { Jobs } from "../model/jobsModel.js";
import { Orders } from "../model/ordersModel.js";
import { Services } from "../model/servicesModel.js";
import { User } from "../model/userModel.js";
import { SiteSettings } from "../model/siteSettingsModel.js";
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

  // increase the applicants count for job order
  if (jobId) {
    isValidId.applicants += 1;
    await isValidId.save();
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
  const { oid, reqUid, recUid, type } = req.query;

  let orders;
  if (oid) {
    orders = await Orders.findById(oid);
  } else if (reqUid) {
    orders = await Orders.find({ reqPersonId: reqUid, type }).sort(
      "-updatedAt"
    );
  } else if (recUid) {
    orders = await Orders.find({ recPersonId: recUid, type }).sort(
      "-updatedAt"
    );
  } else {
    orders = await Orders.find({ type }).sort("-updatedAt");
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
    order.reqPersonId.toString() !== uid.toString() &&
    order.recPersonId.toString() !== uid.toString() &&
    role !== "admin"
  ) {
    return next(new AppError("You are not authorized to change info.", 401));
  }

  // status update on job
  if(order?.type === "jobs"){
    const job = await Jobs.findById(order.jobId);

    job.status = order.status;
    await job.save();
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

// ----------------------- finished order ---------------------
export const finishedOrder = catchAsync(async (req, res, next) => {
  const { oid } = req.params;
  const { _id: uid } = req.user;

  // check if user is the reqPerson
  const order = await Orders.findById(oid);
  if (order.type === "services" && order.reqPersonId.toString() !== uid.toString()) {
    return next(new AppError("You are not authorized.", 401));
  } else if(order.type === "jobs" && order.recPersonId.toString() !== uid.toString()){
    return next(new AppError("You are not authorized.", 401));
  }

  // check if order already finished
  if (order.status === "finished") {
    return next(new AppError("Order is already finished.", 400));
  }

  // fetch reqPerson info
  const reqPerson = await User.findById(order.reqPersonId);

  // fetch recPerson info
  const recPerson = await User.findById(order.recPersonId);

  // check if buyer has enough money
  let hasEnoughMoney = true;
  if (order.type === "services" && reqPerson.balance < order.price) {
    hasEnoughMoney = false;
  } else if (order.type === "jobs" && recPerson.balance < order.price) {
    hasEnoughMoney = false;
  }

  if (!hasEnoughMoney) {
    return next(
      new AppError(
        "You don't have enough balance to finish this service/job.",
        400
      )
    );
  }

  // fetch site settings
  const siteSettings = await SiteSettings.find();
  const { commission } = siteSettings[0];

  const commissionMoney = parseFloat((commission / 100) * order.price);
  const sellerMoney = parseFloat(order.price - commissionMoney);

  // add, sub balance then save
  let buyerMoney;
  if (order.type === "services") {
    buyerMoney = parseFloat(reqPerson.balance - order.price);
    await User.findOneAndUpdate(
      { _id: reqPerson._id },
      { balance: buyerMoney }
    );
    const newSellerMoney = parseFloat(recPerson.balance + sellerMoney);
    await User.findOneAndUpdate(
      { _id: recPerson._id },
      { balance: newSellerMoney }
    );
  } else if (order.type === "jobs") {
    buyerMoney = parseFloat(recPerson.balance - order.price);
    await User.findOneAndUpdate(
      { _id: recPerson._id },
      { balance: buyerMoney }
    );

    const newSellerMoney = parseFloat(reqPerson.balance + sellerMoney);
    await User.findOneAndUpdate(
      { _id: reqPerson._id },
      { balance: newSellerMoney }
    );
  }

  // fetch admin info
  const admin = await User.findOne({ role: "admin" });
  // add commission to the admin account
  const newAdminMoney = parseFloat(admin.balance + commissionMoney);
  await User.findOneAndUpdate({ role: "admin" }, { balance: newAdminMoney });

  // status update on job
  if(order?.type === "jobs"){
    const job = await Jobs.findById(order.jobId);

    job.status = "finished";
    await job.save();
  }

  // update order status
  const orders = await Orders.findOneAndUpdate(
    { _id: oid },
    { status: "finished", finishedDate: req.body.finishedDate, sellerMoney },
    { new: true }
  );

  return res.status(200).json({
    status: "success",
    orders,
  });
});
