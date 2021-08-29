import { body } from "express-validator";

// -------------- rules -------------
export const chatsValidateRules = () => {
  return [body("text").isString().notEmpty()];
};
