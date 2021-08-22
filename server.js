import http from "http";
import express from "express";
import { Server } from "socket.io";
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

// express, http server, env variables
const app = express();
const server = http.createServer(app);
dotenv.config();

// socket creation
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
global.io = io;
global.io.on("connection", () => {
  console.log("user connected!");
});

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
    server.listen(process.env.PORT || 8000, () =>
      console.log("Server Started.")
    );
  });

process.on("unhandledRejection", (err) => {
  console.error(err.name, err.message);
  server.close(() => process.exit(1));
});
