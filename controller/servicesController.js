import { Services } from "../model/servicesModel.js";

// error handler
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// get sercvices info
export const getServices = catchAsync(async (req, res, next) => {
  let services;

  // filter query
  if (req.query.id) {
    services = await Services.findOne({ _id: req.query.id });
  } else if (req.query.uid) {
    services = await Services.find({ userId: req.query.uid });
  } else if (req.query.category) {
    services = await Services.find({ category: req.query.category });
  } else {
    services = await Services.find();
  }

  // no services found
  if (!services) {
    return res.json({
      status: "success",
      length: 0,
      services: [],
    });
  }

  return res.json({
    status: "success",
    length: services.length || 1,
    services,
  });
});

// create a service
export const createServices = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  // check for packages
  if (!req.body.packages || req.body.packages.length <= 0) {
    return next(new AppError("Packages section is required!", 400));
  }

  // check if user has <= 6 services
  const userServices = await Services.countDocuments({ userId });
  if (userServices >= 6) {
    return next(new AppError("Max services reached (6)!", 400));
  }

  const service = await Services.create({
    ...req.body,
    userId,
  });

  return res.status(201).json({
    status: "success",
    service,
  });
});
