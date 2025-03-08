// Database connection logic
const mongoose = require("mongoose");
const { initializeRoles } = require("../services/userService");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Initialize roles on database connection
    await initializeRoles();
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
