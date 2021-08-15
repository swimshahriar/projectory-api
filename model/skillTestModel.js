import mongoose from "mongoose";

const skillTestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxlength: 100,
      required: [true, "Title required."],
    },
    about: {
      type: String,
      required: [true, "About is required."],
    },
    questions: {
      type: Object,
      required: [true, "At least one question is required."],
    },
    options: {
      type: Object,
      required: [true, "Option is required."],
    },
    answers: {
      type: Object,
      required: [true, "Answer is required."],
    },
    duration: {
      type: Number,
      required: [true, "Test duration is required."],
    },
    timesTaken: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// export
export const SkillTests = mongoose.model("SkillTest", skillTestSchema);
