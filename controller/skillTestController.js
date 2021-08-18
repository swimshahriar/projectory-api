// internal imports
import { SkillTests } from "../model/skillTestModel.js";
import CatchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// ------------------ get skill tests ------------------
export const getSkillTests = CatchAsync(async (req, res, next) => {
  const { tid } = req.query;
  const { role } = req.user;

  let skillTests;
  if (tid && role === "user") {
    skillTests = await SkillTests.findById({ _id: tid }).select("-answers");
  } else if (!tid && role === "user") {
    skillTests = await SkillTests.find().select("-answers").sort("-createdAt");
  } else if (tid && role === "admin") {
    skillTests = await SkillTests.findById({ _id: tid });
  } else {
    skillTests = await SkillTests.find().sort("-createdAt");
  }

  return res.status(200).json({
    status: "success",
    skillTests: skillTests,
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
  const { questions, options, answers } = req.body;
  const { tid } = req.params;

  if (questions && options && answers) {
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
  }

  // is skill test available?
  const isAvailable = await SkillTests.findById(tid);

  if (!isAvailable) {
    return next(new AppError("No skill test found with this id.", 404));
  }

  // update skill test
  const skillTests = await SkillTests.findByIdAndUpdate(
    { _id: tid },
    { ...req.body },
    { new: true }
  );

  return res.status(200).json({
    status: "success",
    skillTests,
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
