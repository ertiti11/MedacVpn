const mongoose = require("mongoose");
const { success, error } = require("./libs/utils.js");





async function connectDB () {
  try {
    await mongoose.connect("mongodb://localhost:27017/medacvpn");
    success("Database connected");
  } catch (error) {
    error("Error connecting to database");
  }
};



module.exports = connectDB;