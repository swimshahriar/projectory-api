// internal imports
import { SkillTests } from "../model/skillTestModel.js";
import { SkillTestResults } from "../model/skillTestResultModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

// -------------------- give skill test --------------------
export const giveSkillTest = catchAsync(async (req, res, next) => {
  const { answers } = req.body;
  const { tid } = req.params;
  const { _id: userId } = req.user;

  // check if test exist
  const skillTest = await SkillTests.findById(tid);
  if (!skillTest) {
    return next(new AppError("No skill test found with this id.", 404));
  }

  // check for answers
  let score = 0;
  for (let ans in answers) {
    if (answers[ans] === skillTest.answers[ans]) {
      score++;
    }
  }

  // calculate percent
  const totalQuestions = Object.keys(skillTest.questions).length;
  const percent = parseFloat(((score / totalQuestions) * 100).toFixed(2));

  // save skill test result
  const skillTestResult = new SkillTestResults({
    tid,
    answers,
    score,
    percent,
    userId,
  });
  await skillTestResult.save();

  // update skill test taken count
  skillTest.timesTaken++;
  await skillTest.save();

  return res.status(201).json({
    status: "success",
    skillTestResult,
  });
});

// -------------------- get skill test results -----------------
export const getSkillTestResults = catchAsync(async (req, res, next) => {
  const { uid, tid, trid } = req.query;

  let skillTestResult;
  if (uid) {
    skillTestResult = await SkillTestResults.find({ userId: uid }).sort(
      "-createdAt"
    );
  } else if (tid) {
    skillTestResult = await SkillTestResults.find({ tid }).sort("-createdAt");
  } else if (trid) {
    skillTestResult = await SkillTestResults.findById(trid);
  } else {
    skillTestResult = await SkillTestResults.find().sort("-createdAt");
  }

  return res.status(200).json({
    status: "success",
    skillTestResult,
  });
});

// -------------------- delete skill test result ---------------
export const deleteSkillTestResult = catchAsync(async (req, res, next) => {});
