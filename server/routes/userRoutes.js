// Endpoints for user management
const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/authMiddelware");
const hasRole = require("../middlewares/roleMiddleware");
const userController = require("../controllers/userController");

router.get("/me", isAuthenticated, userController.getMe);

// Only Admins can access the following routes
router.get("/", hasRole(["Admin"]), userController.getAllUsers);
router.get("/:id", hasRole(["Admin"]), userController.getUserById);
router.put("/:id", hasRole(["Admin"]), userController.updateUserById);
router.delete("/:id", hasRole(["Admin"]), userController.deleteUserById);
router.put("/:id/role", hasRole(["Admin"]), userController.updateUserRoleById);

module.exports = router;
