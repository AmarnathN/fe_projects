import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.utils.js";
import moment from "moment";

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
      return;
    }
    const validPassword = bcryptjs.compareSync(
      password,
      validUser._doc.password
    );
    console.log(!validPassword);
    if (!validPassword) {
      next(errorHandler("401", "Invalid credentials!! Unable to Login"));
      return;
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });
    const { password: passwordFromUser, ...restOfUser } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true, expiresIn: 3600 })
      .status(200)
      .json({ ...restOfUser });
  } catch (error) {
    next(error);
  }
};

export const signInGoogle = async (req, res, next) => {
  try {
    console.log(req.body);
    const { username, email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
        expiresIn: 3600,
      });
      const { password: passwordFromUser, ...restOfUser } = validUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true, expiresIn: 3600 })
        .status(200)
        .json({ ...restOfUser });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        moment(new Date()).format("YYYYMMDDHHmmss");
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 15);
      const updatedUsername =
        username.split(" ").join("_") +
        moment(new Date()).format("YYYYMMDDHHmmss");

      console.log("generatedPassword", generatedPassword);
      console.log("hashedPassword", hashedPassword);
      console.log("updatedUsername", updatedUsername);
      const newUser = new User({
        username: updatedUsername,
        email,
        password: hashedPassword,
        avatar: req.body.photoUrl,
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: 3600,
      });
      const { password: passwordFromUser, ...restOfUser } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true, expiresIn: 3600 })
        .status(200)
        .json({ ...restOfUser });
    }
  } catch (error) {
    next(error);
  }
};
