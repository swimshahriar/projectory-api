import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, "First name required."] },
  lastName: { type: String, required: [true, "Last name required."] },
  email: {
    type: String,
    required: [true, "Email required."],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email.s"],
  },
  password: {
    type: String,
    required: [true, "Password required."],
    minlenth: 6,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm password required."],
    minlenth: 6,
    validate: {
      // only works on CREATE & SAVE!
      validator: function (el) {
        return el === this.password; // password === confirmPassword -> true
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

// hash pass
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // if not modified

  // modified pass
  this.password = await bcrypt.hash(this.password, 12); // hash the pass

  this.confirmPassword = undefined; // delete confirm field
});

// compare password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword); // boolean
};

// is password changed
userSchema.methods.chagedPasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return jwtTimestamp < changedTimestamp; // if pass changed before token creation - boolean
  }

  return false;
};

// export
export const User = mongoose.model("User", userSchema);
