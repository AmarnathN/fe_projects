import mongoose from "mongoose";
import {
  ASSETS_ENUM,
  EDUCATION_ENUM,
  GENDER_ENUM,
  INCOME_ENUM,
  MARITAL_STATUS_ENUM,
  PROFESSION_ENUM,
} from "../config/enums.config.js";

const heightSchema = new mongoose.Schema({
  feet: {
    type: Number,
    required: true,
  },
  inches: {
    type: Number,
    required: true,
  },
});

const profileSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^(\+\d{1,3}[- ]?)?\d{10}$/,
        "Please enter a valid phone number",
      ],
    },
    gender: {
      type: String,
      required: true,
      enum: GENDER_ENUM,
    },
    age: {
      type: Number,
      required: true,
    },
    dob:{
      type: Date,
      required: true,
    },
    height: {
      type: heightSchema,
      required: true,
    },
    profession: {
      type: String,
      required: true,
      enum: PROFESSION_ENUM,
    },
    education: {
      type: String,
      required: true,
      enum: EDUCATION_ENUM,
    },
    maritalStatus: {
      type: String,
      required: true,
      enum: MARITAL_STATUS_ENUM,
    },
    income: {
      type: String,
      required: true,
      enum: INCOME_ENUM
    },
    assets: [
      {
        type: String,
        enum: ASSETS_ENUM,
      },
    ],
    bio: {
      type: String,
      required: true,
    },
    profilePictures:[ {
      type: String,
      required: true,
    }],
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
