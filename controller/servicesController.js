import { Services } from "../model/servicesModel.js";

// error handler
import catchAsync from "../utils/catchAsync.js";

// get sercvices info
export const getServices = catchAsync(async (req, res, next) => {
  res.json({
    status: "success",
  });
});
