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
import { chatsRoutes } from "./routes/chatsRoutes.js";

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

// ---------------------- socket functions --------------------------
let users = [];

// ------------------- helper functions --------------
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

// ------------------ socket connection -----------------
io.on("connection", (socket) => {
  // on connect
  console.log("new user connected!");

  // take user and socket id from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  // on disconnect remove user
  socket.on("disconnect", () => {
    console.log("a user left!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
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
app.use("/api/chats", chatsRoutes);

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
