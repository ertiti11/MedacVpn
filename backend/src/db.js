const mongoose = require("mongoose");
const { success, error } = require("./libs/utils.js");
const { MONGODB_URI_PROD, MONGODB_URI_DEV } = require("./config.js");
async function connectDB() {
  try {
    if (process.env.NODE_ENV === "production") {
      await mongoose.connect(MONGODB_URI_PROD);
      success("Database connected");
    } else {
      await mongoose.connect(MONGODB_URI_DEV);
      success("Database connected");
    }
  } catch (error) {
    console.log("Database connection failed: ", error);
    process.exit(1);
  }
}

module.exports = connectDB;
