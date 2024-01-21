import express from "express";
import mongoose from "mongoose";

mongoose
  .connect(
    "mongodb+srv://vayuteja:vayuteja@rela-estate.hcmjkgs.mongodb.net/real-estate?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.listen(3000, () => {
  console.log("Api running on 3000 ! ");
});
