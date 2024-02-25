import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9]+$/,
        "Username must contain only letters and numbers",
      ],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match:
        [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Please enter a valid email"
        ]
    },
    password: {
      type: String,
      required: true,
      match:
        [
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
          "Password must contain at least 8 characters, including UPPER/lowercase and numbers"
        ]
    },
    avatar:{
      type: String,
      default: "https://i0.wp.com/www.cssscript.com/wp-content/uploads/2020/12/Customizable-SVG-Avatar-Generator-In-JavaScript-Avataaars.js.png?fit=438%2C408&ssl=1"
    },
  },
  {
    timestamps: true,
  }
);


const User =  mongoose.model("User", userSchema);

export default User;