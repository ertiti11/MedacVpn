import mongoose from "mongoose";
import {success, error} from "./libs/utils.js"
export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/medacvpn");
    success("Database connected");
  } catch (error) {
    error("Error connecting to database");
  }
};
