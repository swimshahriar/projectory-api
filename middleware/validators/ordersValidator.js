import { body } from "express-validator";

// -------------- rules -------------
export const ordersValidateRules = () => {
  return [
    body("price").isNumeric().notEmpty(),
    body("recPersonId").isString().notEmpty(),
    body("recPersonUserName").isString().notEmpty(),
    body("brief").isString().notEmpty(),
    body("type").isString().notEmpty(),
    body("title").isString().notEmpty(),
    body("duration").isNumeric().notEmpty(),
  ];
};
