import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import { errorHandler } from "../utils/error.utils.js";

dotenv.config();

export const signUp = async (req, res, next) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 15);

  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({
      message: "user created successfully",
    });
  } catch (error) {
    next(error);
    // next (errorHandler("550", "failed creating user !!"));
  }
};
