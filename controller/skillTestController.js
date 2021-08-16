// internal imports
import { SkillTests } from "../model/skillTestModel.js";
import CatchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// ------------------ get skill tests ------------------
export const getSkillTests = CatchAsync(async (req, res, next) => {
  const { tid } = req.query;

  let skillTests;
  if (tid) {
    skillTests = await SkillTests.findById({ _id: tid });
  } else {
    skillTests = await SkillTests.find().sort("-createdAt");
  }

  return res.status(200).json({
    status: "success",
    skillTests: skillTests ? Array(skillTests) : [],
  });
});

// ------------------ create skill test -----------------
export const createSkillTest = CatchAsync(async (req, res, next) => {
  const { questions, options, answers } = req.body;

  if (
    Object.keys(questions).length <= 0 ||
    Object.keys(options).length <= 0 ||
    Object.keys(answers).length <= 0
  ) {
    return next(new AppError("No questions or options or answers.", 400));
  }

  if (
    Object.keys(questions).length !== Object.keys(options).length ||
    Object.keys(options).length !== Object.keys(answers).length ||
    Object.keys(questions).length !== Object.keys(answers).length
  ) {
    return next(new AppError("question !== options !== answers", 400));
  }

  // create skill test
  const skillTests = new SkillTests({
    ...req.body,
  });

  await skillTests.save();

  return res.status(201).json({
    status: "success",
    skillTests,
  });
});

// ------------------ update skill test -----------------
export const updateSkillTest = CatchAsync(async (req, res, next) => {
  return res.status(200).json({
    status: "success",
  });
});

// ------------------ delete skill test -----------------
export const deleteSkillTest = CatchAsync(async (req, res, next) => {
  const { tid } = req.params;

  if (!tid) {
    return next(new AppError("Test id is required.", 400));
  }

  const skillTest = await SkillTests.findById(tid);

  if (!skillTest) {
    return next(new AppError("No test found with this test id.", 404));
  }

  await SkillTests.findByIdAndDelete(tid);

  return res.status(200).json({
    status: "success",
  });
});
