import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json()) // by default json is not allowed to be send in request unless specified here

app.listen(3000, () => {
  console.log("Api running on 3000 ! ");
});

app.use("/api/auth", authRouter);
