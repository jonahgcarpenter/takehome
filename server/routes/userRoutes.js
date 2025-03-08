// Endpoints for user management
const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/authMiddleware");
const hasRole = require("../middlewares/roleMiddleware");
const userController = require("../controllers/userController");

// Retrieve the currently logged in user
router.get("/me", isAuthenticated, userController.getMe);

// Retrieve all users (Admin only)
router.get("/", hasRole(["Admin"]), userController.getAllUsers);

// Retrieve a specific user by ID (Admin only)
router.get("/:id", hasRole(["Admin"]), userController.getUserById);

// Update a user by ID (Admin only)
router.put("/:id", hasRole(["Admin"]), userController.updateUserById);

// Delete a user by ID (Admin only)
router.delete("/:id", hasRole(["Admin"]), userController.deleteUserById);

// Update a user's role by ID (Admin only)
router.put("/:id/role", hasRole(["Admin"]), userController.updateUserRoleById);

module.exports = router;
