import { Services } from "../model/servicesModel.js";
import { Ratings } from "../model/ratingReviewsModel.js";

// config
import { cloudinary } from "../config/cloudinary.js";

// error handler
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// get sercvices info
export const getServices = catchAsync(async (req, res, next) => {
  let services;

  // filter query
  if (req.query.sid) {
    services = await Services.findOne({ _id: req.query.sid });
  } else if (req.query.uid) {
    services = await Services.find({ userId: req.query.uid }).sort(
      "-createdAt"
    );
  } else if (req.query.category) {
    services = await Services.find({ category: req.query.category }).sort(
      "-createdAt"
    );
  } else {
    services = await Services.find().sort("-createdAt");
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

  // check for image empty
  if (!req.body.images || req.body.images.length <= 0) {
    return next(new AppError("Atleast one image is required.", 400));
  }

  // upload images to cloudinary
  const imgUrls = [];
  for (let i = 0; i < req.body.images.length; i++) {
    const uploadedImg = await cloudinary.uploader.upload(req.body.images[i], {
      upload_preset: "projectory_services",
    });

    imgUrls.push(uploadedImg.public_id);
  }

  // check if imgUrls is empty
  if (imgUrls.length <= 0) {
    return next(new AppError("Image upload failed.", 500));
  }

  const service = await Services.create({
    ...req.body,
    images: imgUrls,
    userId,
    userName: req.user.userName,
    userImg: req.user.avatar,
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

  // check if images changed
  let isImageChanged = false;
  const isSameLength = req.body.images.length === service.images.length;

  if (isSameLength) {
    for (let i = 0; i < service.images.length; i++) {
      if (req.body.images[i] !== service.images[i]) {
        isImageChanged = true;
        break;
      }
    }
  }

  if (isImageChanged || !isSameLength) {
    // mongoose transaction
    const session = await Services.startSession();
    session.startTransaction();
    const imgUrls = [];
    // upload images to cloudinary
    for (let i = 0; i < req.body.images.length; i++) {
      const uploadedImg = await cloudinary.uploader.upload(req.body.images[i], {
        upload_preset: "projectory_services",
      });

      imgUrls.push(uploadedImg.public_id);
    }

    // check if imgUrls is empty
    if (imgUrls.length <= 0) {
      return next(new AppError("Image upload failed.", 500));
    }

    // delete old images
    for (let i = 0; i < service.images.length; i++) {
      await cloudinary.uploader.destroy(service.images[i]);
    }

    // update
    const updatedService = await Services.findOneAndUpdate(
      { _id: sid },
      { ...req.body, images: imageUrls },
      { new: true, runValidators: true }
    );
    session.endSession();

    return res.status(200).json({
      status: "success",
      services: updatedService,
    });
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

  // transaction
  const session = await Services.startSession();
  session.startTransaction();

  // delete ratings
  await Ratings.deleteMany({ serviceId: sid });

  // delete service
  await Services.findOneAndDelete({ _id: sid });

  for (let i = 0; i < service.images.length; i++) {
    await cloudinary.uploader.destroy(service.images[i]);
  }

  session.endSession();

  res.status(200).json({
    status: "success",
  });
});
