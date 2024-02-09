import mongoose from "mongoose";

const phoneNumberSchema = new mongoose.Schema({
  countryCode: {
    type: String,
    required: true,
    // You may want to add additional validation for the country code, such as a specific format or length
  },
  number: {
    type: String,
    required: true,
    // You may want to add additional validation for the phone number, such as a specific format or length
  },
});

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
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: phoneNumberSchema,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["m", "f"],
    },
    age: {
      type: Number,
      required: true,
    },
    height: {
      type: heightSchema,
      required: true,
    },
    profession: {
      type: String,
      required: true,
      enum: ["job", "student", "business", "other"],
    },
    education: {
      type: String,
      required: true,
      enum: ["undergraduate", "graduate", "masters", "phd", "other"],
    },
    maritalStatus: {
      type: String,
      required: true,
      enum: ["single", "married", "divorced", "widowed", "other"],
    },
    income: {
      type: Number,
    },
    assets: [
      {
        type: String,
        enum: ["car", "house", "land", "other"],
      },
    ],
    bio: {
      type: String,
      required: true,
    },
    profilePictures: {
        type: Array,
    },
    userRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
  },
  {
    timestamps: true,
  }
);


const Profile = mongoose.model("Profile", profileSchema);

export default Profile;



