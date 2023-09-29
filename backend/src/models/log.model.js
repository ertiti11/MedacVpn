const mongoose = require("mongoose");
// :method :url :status :res[content-length] - :response-time ms
const logSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: true,
      trim: true,
    },
    method: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
    },
    contentLength: {
      type: String,
      required: true,
      trim: true,
    },
    responseTime: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("Log", logSchema);

