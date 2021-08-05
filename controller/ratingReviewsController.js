import { Ratings } from "../model/ratingReviewsModel.js";
import { Services } from "../model/servicesModel.js";

// error handlers
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

// get ratings reviews
export const getRatingReviews = catchAsync(async (req, res, next) => {
  const query = req.query;

  let ratings;
  if (query.rid) {
    ratings = await Ratings.findById(query.rid);
  } else if (query.sid) {
    ratings = await Ratings.find({ serviceId: query.sid }).sort("-createdAt");

    if (!ratings || ratings.length > 0) {
      const rating =
        ratings.reduce((acc, curr) => (acc += curr.star), 0) / ratings.length;

      await Services.findOneAndUpdate(
        { _id: query.sid },
        {
          rating: {
            rating: +rating.toFixed(2),
            count: ratings.length,
          },
        }
      );

      return res.status(200).json({
        status: "success",
        length: ratings.length <= 0 ? 0 : ratings.length,
        rating: +rating.toFixed(2),
        ratings,
      });
    }
  } else if (query.uid) {
    ratings = await Ratings.find({ userId: query.uid }).sort("-createdAt");
  } else {
    ratings = await Ratings.find().sort("-createdAt");
  }

  if (!ratings) {
    return next(
      new AppError("Wrong query id or no ratings related with that id.", 404)
    );
  }

  res.status(200).json({
    status: "success",
    length: ratings.length <= 0 ? 0 : ratings.length,
    ratings,
  });
});

// create rating reviews
export const createRatingReviews = catchAsync(async (req, res, next) => {
  const { _id: uid, userName } = req.user;
  const { sid } = req.params;

  // check for sid or star
  if (!sid || !req.body.star) {
    return next(new AppError("Missing service id or star.", 400));
  }

  // check if service exist
  const service = await Services.findById(sid);

  if (!service) {
    return next(new AppError("No service found with provided id.", 404));
  }

  const ratings = await Ratings.create({
    ...req.body,
    userName,
    userId: uid,
    serviceId: sid,
  });

  // update rating count
  const allRatings = await Ratings.find({ serviceId: sid });
  const rating =
    allRatings.reduce((acc, curr) => (acc += curr.star), 0) / allRatings.length;

  await Services.findOneAndUpdate(
    { _id: sid },
    {
      rating: {
        rating: +rating.toFixed(2),
        count: allRatings.length,
      },
    }
  );

  res.status(201).json({
    status: "success",
    ratings,
  });
});

// delete rating reviews
export const deleteRatingReviews = catchAsync(async (req, res, next) => {
  const { rid } = req.params;
  const { _id: uid } = req.user;

  // check if the rating exist
  const rating = await Ratings.findById(rid);

  if (!rating || rating.length <= 0) {
    return next(new AppError("No rating found with provided id.", 404));
  }

  // check if the user is creator of the rating or admin
  if (
    rating.userId.toString() !== uid.toString() &&
    req.user.role !== "admin"
  ) {
    console.log(rating.userId.toString() !== uid.toString());
    return next(new AppError("You do not have the permission to delete.", 403));
  }

  const { serviceId } = rating;

  // delete
  await Ratings.deleteOne({ _id: rid });

  // update rating count of the service
  const allRatings = await Ratings.find({ serviceId });
  if (!allRatings || allRatings.length <= 0) {
    await Services.findOneAndUpdate(
      { _id: serviceId },
      {
        rating: {
          rating: 0,
          count: 0,
        },
      }
    );

    return res.status(200).json({
      status: "success",
    });
  }

  // more rating of service > 0
  const newRating =
    allRatings.reduce((acc, curr) => (acc += curr.star), 0) / allRatings.length;

  await Services.findOneAndUpdate(
    { _id: serviceId },
    {
      rating: {
        rating: +newRating.toFixed(2),
        count: allRatings.length,
      },
    }
  );

  return res.status(200).json({
    status: "success",
  });
});
