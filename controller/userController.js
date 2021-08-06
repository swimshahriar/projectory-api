import { User } from "../model/userModel.js";
import { Services } from "../model/servicesModel.js";

import { cloudinary } from "../config/cloudinary.js";

// error handler
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// user info
export const getUserInfo = catchAsync(async (req, res, next) => {
  const { uid } = req.params;

  if (!uid) {
    return next(new AppError("Please provide user id!", 400));
  }

  const user = await User.findById(uid);

  if (!user) {
    return next(new AppError("Incorrect user id!", 401));
  }

  return res.status(200).json({
    status: "success",
    user,
  });
});

// update user info
export const updateUserInfo = catchAsync(async (req, res, next) => {
  const { _id: uid } = req.user;
  let newAvatar;
  if (req.body.avatar && req.user.avatar !== req.body.avatar) {
    const response = await cloudinary.uploader.upload(req.body.avatar, {
      upload_preset: "projectory_avatars",
    });

    req.user.avatar && (await cloudinary.uploader.destroy(req.user.avatar));
    newAvatar = response.public_id;

    // changing services userImg
    const services = await Services.find({ userId: uid });
    if (services || services?.length <= 0) {
      for (let i = 0; i < services.length; i++) {
        await Services.findByIdAndUpdate(
          { _id: services[i]._id },
          { userImg: newAvatar }
        );
      }
    }
  }

  const oldUserData = await User.findById(uid);

  const newUserData = await User.findOneAndUpdate(
    { _id: uid },
    {
      ...oldUserData._doc,
      ...req.body,
      avatar: newAvatar ? newAvatar : oldUserData.avatar,
    },
    { new: true, runValidators: true, context: "query" }
  );

  return res.status(200).json({
    status: "success",
    user: newUserData,
  });
});
