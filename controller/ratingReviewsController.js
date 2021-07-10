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
