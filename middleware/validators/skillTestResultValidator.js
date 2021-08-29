import { body } from "express-validator";

// -------------- rules -------------
export const giveSkillTestValidateRules = () => {
  return [body("answers").isObject().notEmpty()];
};
