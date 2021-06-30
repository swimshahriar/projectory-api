import crypto from "crypto";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, "First name required."] },
  lastName: { type: String, required: [true, "Last name required."] },
  userName: {
    type: String,
    required: [true, "User name required."],
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, "Email required."],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email."],
  },
  avatar: {
    type: String,
    validate: [validator.isURL, "Please provide a photo url."],
    default: undefined,
  },
  tagLine: {
    type: String,
    maxlenth: 50,
    default: undefined,
  },
  location: {
    type: String,
    default: undefined,
  },
  description: {
    type: String,
    maxlenth: 150,
    default: undefined,
  },
  languages: {
    type: [
      {
        title: {
          type: String,
          required: true,
        },
        level: {
          type: String,
          required: true,
        },
      },
    ],
    default: undefined,
  },
  linkedAccounts: [
    {
      title: {
        type: String,
        required: [true, "LinkedAccount title required"],
      },
      link: {
        type: String,
        validate: [validator.isURL],
        required: [true, "LinkedAccount link required"],
      },
    },
  ],
  skills: {
    type: Array,
    validate: [validator.isEmpty, "Cannot be empty"],
    default: undefined,
  },
  education: {
    type: [
      {
        degree: {
          type: String,
          required: true,
        },
        institute: {
          type: String,
          required: true,
        },
        location: {
          type: String,
          required: true,
        },
        year: {
          type: Number,
          required: true,
        },
      },
    ],
    default: undefined,
  },
  role: {
    type: String,
    enum: ["user"],
    default: "user",
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
  passwordResetToken: String,
  passwordResetExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// hash pass
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // if not modified

  // modified pass
  this.password = await bcrypt.hash(this.password, 12); // hash the pass

  this.confirmPassword = undefined; // delete confirm field
});

// on password change update changed at time
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000; // 1 sec past because sign token may take some time
  next();
});

// compare password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword); // boolean
};

// is password changed
userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return jwtTimestamp < changedTimestamp; // if pass changed before token creation - boolean
  }

  return false;
};

// reset password token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 min

  return resetToken;
};

// export
export const User = mongoose.model("User", userSchema);
