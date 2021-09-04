import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import logger from "morgan";
import dotenv from "dotenv";

// uncought exception handler
process.on("uncaughtException", (err) => {
  console.error(err.name, err.message);
  process.exit(1);
});

// error handler
import AppError from "./utils/appError.js";
import globalErrorHandler from "./controller/errorController.js";

// router
import { userRoutes } from "./routes/userRoutes.js";
import { servicesRoutes } from "./routes/servicesRoutes.js";
import { ratingReviewsRoutes } from "./routes/ratingReviewsRoutes.js";
import { jobsRoutes } from "./routes/jobsRoutes.js";
import { skillTestRoutes } from "./routes/skillTestRoutes.js";
import { skillTestResultRoutes } from "./routes/skillTestResultRoutes.js";
import { chatsRoutes } from "./routes/chatsRoutes.js";
import { siteSettingsRoutes } from "./routes/siteSettingsRoutes.js";
import { ordersRoutes } from "./routes/ordersRoutes.js";
import { paymentsRoutes } from "./routes/paymentsRoutes.js";

// express, env variables
const app = express();
dotenv.config();

// middlewares
app.use(logger("tiny"));
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "30mb" }));

// routes
app.use("/api/user", userRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/rating-review", ratingReviewsRoutes);
app.use("/api/skill-test", skillTestRoutes);
app.use("/api/skill-test-result", skillTestResultRoutes);
app.use("/api/chats", chatsRoutes);
app.use("/api/site-settings", siteSettingsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/payments", paymentsRoutes);

app.all("*", (req, res, next) => {
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
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB Connected!");
    app.listen(process.env.PORT || 8000, () => console.log("Server Started."));
  });

process.on("unhandledRejection", (err) => {
  console.error(err.name, err.message);
  app.close(() => process.exit(1));
});
