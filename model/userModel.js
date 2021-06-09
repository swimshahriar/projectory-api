import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, "First name required."] },
  lastName: { type: String, required: [true, "Last name required."] },
  email: { type: String, required: [true, "Email required."], unique: true },
  password: {
    type: String,
    required: [true, "Password required."],
    minlenth: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// export
export const User = mongoose.model("User", userSchema);
