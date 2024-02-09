import e from "express";
import Profile from "../models/profile.model.js";
import { errorHandler } from "../utils/error.utils.js";


export const createProfile = async (req, res, next) => {
  try {
    const profile = await Profile.create(req.body);
    console.log(profile);
    res.status(201).json(profile);
  } catch (err) {
    console.log(err);
    next(errorHandler(500, err.message  || "Failed to create profile"));
  }
};
