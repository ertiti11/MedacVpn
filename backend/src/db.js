import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/medacvpn");
    console.log("Database connected");
  } catch (error) {
    throw new Error("Error connecting to database");
  }
};
