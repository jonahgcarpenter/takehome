// Handles user profile operations (view, update, etc.)
const User = require("../models/userModel");
const Role = require("../models/roleModel");

// Helper function that converts a Mongoose user document into a plain object,
// replacing the role ID with its name and deleting totpSecret.
const transformUser = async (userDoc) => {
  let user = userDoc.toObject();
  // Look up the role by its ID.
  const role = await Role.findById(user.role);
  if (role) {
    user.role = role.name;
  }
  // Remove totpSecret from the response.
  delete user.totpSecret;
  return user;
};

// GET /api/users/me
// Retrieve the currently logged in user
exports.getMe = async (req, res) => {
  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user = await transformUser(user);
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// GET /api/users
// Retrieve all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    // Transform each user before returning the response.
    const transformedUsers = await Promise.all(
      users.map((user) => transformUser(user)),
    );
    return res.status(200).json(transformedUsers);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// GET /api/users/:id
// Retrieve a specific user by ID (Admin only)
exports.getUserById = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user = await transformUser(user);
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// PUT /api/users/:id
// Update a user by ID (Admin only)
exports.updateUserById = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If role is being updated, validate and convert role name to ID
    if (req.body.role) {
      const role = await Role.findOne({ name: req.body.role });
      if (!role) {
        return res.status(400).json({ message: "Invalid role specified" });
      }
      req.body.role = role._id;
    }

    // Update user fields with data from req.body
    Object.assign(user, req.body);
    const updatedUser = await user.save();
    const transformedUser = await transformUser(updatedUser);

    // Emit update via WebSocket
    const io = req.app.get("socketio");
    io.emit("user-updated", transformedUser);

    return res.status(200).json(transformedUser);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/users/:id
// Delete a user by ID (Admin only)
exports.deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Emit delete via WebSocket
    const io = req.app.get("socketio");
    io.emit("user-updated", { id: req.params.id });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};