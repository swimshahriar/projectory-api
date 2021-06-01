import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import logger from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// middlewares
app.use(helmet());
app.use(
  cors({
    origin: ["*"],
  })
);
app.use(logger("tiny"));
app.use(express.json());

// routes
app.use("/", (_, res) => {
  res.status(200).json({
    status: "running",
  });
});

// server connect
app.listen(process.env.PORT || 8000, () => console.log("server started."));
