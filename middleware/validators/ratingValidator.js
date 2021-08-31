import { body } from "express-validator";

// -------------- rules -------------
export const ratingValidateRules = () => {
  return [
    body("star").isNumeric().notEmpty(),
    body("review").isString().notEmpty(),
    body("orderId").isString().notEmpty(),
  ];
};
