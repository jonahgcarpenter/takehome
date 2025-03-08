// Retrieves audit logs for admin users
const Log = require("../models/logModel");

// GET /api/logs
// Retrieve all logs (Admin only)
exports.getLogs = async (req, res) => {
  try {
    // Retrieve logs in descending order (most recent first)
    const logs = await Log.find({}).sort({ timestamp: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/logs/user/:id
// Retrieve logs for a specific user (Admin only)
exports.getLogsByUser = async (req, res) => {
  try {
    const userId = req.params.id;
    // Find logs where the 'user' field matches the provided user ID.
    const logs = await Log.find({ user: userId }).sort({ timestamp: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/logs/role/(Admin/Staff/Customer)
// Retrieve logs for a specific role (Admin only)
exports.getLogsByRole = async (req, res) => {
  try {
    const roleName = req.params.role;
    // Use case-insensitive search by using a regular expression.
    const logs = await Log.find({
      role: { $regex: new RegExp(`^${roleName}$`, "i") },
    }).sort({ timestamp: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/logs
// Clear all logs (Admin only)
exports.clearLogs = async (req, res) => {
  try {
    await Log.deleteMany({});
    res.status(200).json({ message: "All logs cleared" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
