// db models
import { User } from "../model/userModel.js";
import { Services } from "../model/servicesModel.js";

// handle errors
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// get favorite services by uid
export const getFavoriteServices = catchAsync(async (req, res, next) => {
  const { favoriteServices } = req.user;

  // if no favorite services added yet
  if (!favoriteServices || favoriteServices.length <= 0) {
    return res.status(200).json({
      status: "success",
      length: 0,
      favoriteServices,
    });
  }

  // fetching each service info + storing in an array
  const favServices = [];
  favoriteServices.reverse();
  for (let i = 0; i < favoriteServices.length; i++) {
    const serviceInfo = await Services.findById(favoriteServices[i]);
    favServices.push(serviceInfo);
  }

  return res.status(200).json({
    status: "success",
    length: favServices.length,
    services: favServices,
  });
});

// add a favorite service in the user profile
export const addFavoriteService = catchAsync(async (req, res, next) => {
  const { sid } = req.params;
  const { favoriteServices, _id: uid } = req.user;

  if (!sid) {
    return next(new AppError("Service id required.", 400));
  }

  // check if service exist or valid id
  const service = await Services.findById(sid);
  if (!service) {
    return next(new AppError("Service deleted / wrong id.", 404));
  }

  let favServicesList = [];
  if (favoriteServices && favoriteServices.includes(sid)) {
    favServicesList = favoriteServices.filter((service) => service !== sid);
  } else {
    favServicesList =
      !favoriteServices || favoriteServices.length <= 0
        ? [sid]
        : [...favoriteServices, sid];
  }

  const { favoriteServices: newfavoriteServices } = await User.findOneAndUpdate(
    { _id: uid },
    { favoriteServices: favServicesList },
    { new: true }
  );

  // fetching each service info + storing in an array
  const favServices = [];
  newfavoriteServices.reverse();
  for (let i = 0; i < newfavoriteServices.length; i++) {
    const serviceInfo = await Services.findById(newfavoriteServices[i]);
    favServices.push(serviceInfo);
  }

  return res.status(200).json({
    status: "succes",
    length: favServices.length,
    services: favServices,
  });
});
