import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.utils.js";

dotenv.config();

export const signUp = async (req, res, next) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 15);

  try {
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      message: "user created successfully",
    });
  } catch (error) {
    next(error);
    // next (errorHandler("550", "failed creating user !!"));
  }
};

export const signIn = async (req, res, next) => {
  console.log(req.body);
  const { username, password } = req.body;
  try {
    const validUser = await User.findOne({ username });
    if (!validUser) {
      next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      next(errorHandler(401, "Invalid credentials!! Unable to Login"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });
    res
      .cookie("access_token", token, { httpOnly: true, expiresIn: 3600 })
      .status(200)
      .json({
        message: "user logged in successfully"
      });
  } catch (error) {
    next(error);
  }
};
