import { body } from "express-validator";

// -------------- rules -------------
export const paymentsValidateRules = () => {
  return [
    body("amount").isNumeric().notEmpty(),
    body("paymentType").isString().notEmpty(),
    body("method").isString().notEmpty(),
  ];
};
