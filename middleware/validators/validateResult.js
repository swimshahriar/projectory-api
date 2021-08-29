import { validationResult } from "express-validator";

// ------------------ validate results ---------------
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(400).json({
    status: "fail",
    message: extractedErrors,
  });
};
