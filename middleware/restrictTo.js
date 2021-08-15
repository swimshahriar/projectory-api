// restrict by role - authorization
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new App("You do not have permission to perform this action.", 403)
      );
    }

    next();
  };
};