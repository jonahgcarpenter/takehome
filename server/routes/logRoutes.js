// Endpoints for accessing audit logs
const express = require("express");
const router = express.Router();
const hasRole = require("../middlewares/roleMiddleware");
const logController = require("../controllers/logController");

// Retrieve all logs (Admin only)
router.get("/", hasRole(["Admin"]), logController.getLogs);

// Retrieve logs for a specific user (Admin only)
router.get("/user/:id", hasRole(["Admin"]), logController.getLogsByUser);

// Retrieve logs for specific role (Admin only)
router.get("/role/:role", hasRole(["Admin"]), logController.getLogsByRole);

// Clear all logs (Admin only)
router.delete("/", hasRole(["Admin"]), logController.clearLogs);

module.exports = router;
