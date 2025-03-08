// Log schema/model for tracking CRUD operations
const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  method: {
    type: String,
    required: true,
  },
  route: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  role: {
    type: String,
  },
  ip: {
    type: String,
  },
  headers: {
    type: Object,
  },
  query: {
    type: Object,
  },
  body: {
    type: Object,
  },
  responseStatus: {
    type: Number,
  },
  errorDetails: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  details: {
    type: Object,
  },
});

const Log = mongoose.model("Log", logSchema);

module.exports = Log;
