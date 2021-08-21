import mongoose from "mongoose";

const skillTestResultSchema = new mongoose.Schema(
  {
    tid: {
      type: mongoose.Types.ObjectId,
      required: [true, "Test id is required."],
    },
    title: {
      type: String,
      required: [true, "Title is required."],
    },
    questions: {
      type: Object,
      required: [true, "Questions are required."],
    },
    answers: {
      type: Object,
      required: [true, "Answers are required."],
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: [true, "User id required."],
    },
    score: {
      type: Number,
      required: [true, "Score is required."],
    },
    percent: {
      type: Number,
      required: [true, "Percent is required."],
    },
    pass: {
      type: Boolean,
      required: [true, "Pass required."],
    },
  },
  { timestamps: true }
);

// export
export const SkillTestResults = mongoose.model(
  "SkillTestResult",
  skillTestResultSchema
);
