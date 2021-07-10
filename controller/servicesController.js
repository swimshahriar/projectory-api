import { Services } from "../model/servicesModel.js";

// config
import cloudinary from "../config/cloudinary.js";

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
  if (!services || services.length <= 0) {
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

  // upload images to cloudinary
  const imgUrls = [];
  for (img in req.body.images) {
    const uploadedImg = await cloudinary.uploader.upload(img, {
      upload_preset: "upload_service",
    });
    imgUrls.push(uploadedImg.url);
  }

  const service = await Services.create({
    ...req.body,
    images: imgUrls,
    userId,
  });

  return res.status(201).json({
    status: "success",
    service,
  });
});

// update services
export const updateServices = catchAsync(async (req, res, next) => {
  const { sid } = req.params;
  const { _id: uid } = req.user;

  // check if req.body is empty
  if (Object.keys(req.body).length === 0) {
    return next(new AppError("Request body cannot be empty!", 400));
  }

  // check if service exist
  const service = await Services.findById(sid);

  if (!service) {
    return next(new AppError("No service found with provied id.", 404));
  }

  // check if requested user is the creator of the service
  if (service.userId.toString() !== uid.toString()) {
    return next(new AppError("You do not have the permission.", 403));
  }

  // update
  const updatedService = await Services.findOneAndUpdate(
    { _id: sid },
    { ...req.body },
    { new: true, runValidators: true }
  );

  return res.status(200).json({
    status: "success",
    services: updatedService,
  });
});

// delete service
export const deleteService = catchAsync(async (req, res, next) => {
  const { sid } = req.params;
  const { _id: uid } = req.user;

  // check if service exist
  const service = await Services.findById(sid);

  if (!service) {
    return next(new AppError("No service found with provied id.", 404));
  }

  // check if requested user is the creator of the service
  if (service.userId.toString() !== uid.toString()) {
    return next(new AppError("You do not have the permission.", 403));
  }

  // delete
  await Services.findOneAndDelete({ _id: sid });

  res.status(200).json({
    status: "success",
  });
});
