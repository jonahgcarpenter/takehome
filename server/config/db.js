// Database connection logic
const mongoose = require("mongoose");
const { initializeRoles } = require("../services/roleService");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await initializeRoles();
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
