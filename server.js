import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import logger from "morgan";
import dotenv from "dotenv";

// error handler
import AppError from "./utils/appError.js";
import globalErrorHandler from "./controller/errorController.js";

// router
import { authRoutes } from "./routes/authRoutes.js";

// env variable
dotenv.config();

const app = express();

// middlewares
if (process.env.NODE_ENV === "developement") {
  app.use(logger("tiny"));
}
app.use(helmet());
app.use(
  cors({
    origin: ["*"],
  })
);
app.use(express.json());

// routes
// auth routes
app.use("/api/auth", authRoutes);

app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `cannot find ${req.originalUrl} on this server!`,
  // });

  next(new AppError(`cannot find ${req.originalUrl} on this server!`, 404));
});

// error handler
app.use(globalErrorHandler);

// server connect
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB Connected!");
    app.listen(process.env.PORT || 8000, () => console.log("Server Started."));
  })
  .catch((err) => console.log(err.message));
