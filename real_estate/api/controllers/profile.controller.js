import e from "express";
import Profile from "../models/profile.model.js";
import { errorHandler } from "../utils/error.utils.js";


export const createProfile = async (req, res, next) => {
  try {
    const data = req.body;
    data.userRef=req.user.id;
    console.log(data);
    const profile = await Profile.create(req.body);
    console.log(profile);
    res.status(201).json(profile);
  } catch (err) {
    console.log(err);
    next(errorHandler(500, err.message  || "Failed to create profile"));
  }
};

export const getProfiles = async (req, res, next) => {
  try {
    const profiles = await Profile.find({}).sort({createdAt: -1});
    res.status(200).json(profiles);
  } catch (err) {
    console.log(err);
    next(errorHandler(500, err.message  || "Failed to create profile"));
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findById(req.params.id);
    res.status(200).json(profile);
  } catch (err) {
    console.log(err);
    next(errorHandler(500, err.message  || "Failed to get profile"));
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findByIdAndUpdate(req.params.id,
      req.body,
      {new: true} 
    );
    if(!profile){
      return next(errorHandler(404, "Profile not found to update"));
    }
    console.log(profile);
    res.status(200).json(profile);
  }catch(err){
    console.log(err);
    next(errorHandler(500, err.message  || "Failed to update profile"));
  }
}


export const deleteProfile =  async (req, res, next) => {
  try{
    const profile = await Profile.findByIdAndDelete(req.params.id);
    if(!profile){
      return next(errorHandler(404, "Profile not found to delete"));
    }
    res.status(200).json("User with id: " + req.params.id + " has been deleted)");
  }catch(error){
    next(errorHandler(500, err.message  || "Failed to delete profile"));
  }
}