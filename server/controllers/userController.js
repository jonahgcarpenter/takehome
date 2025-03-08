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

exports.updateUserById = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Update user fields with data from req.body.
    Object.assign(user, req.body);
    const updatedUser = await user.save();
    const transformedUser = await transformUser(updatedUser);
    return res.status(200).json(transformedUser);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.updateUserRoleById = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Look up the role document using the role name sent in the request body
    const roleDoc = await Role.findOne({ name: req.body.role });
    if (!roleDoc) {
      return res.status(400).json({ message: "Invalid role provided" });
    }
    // Update the user's role with the role document's _id
    user.role = roleDoc._id;
    await user.save();
    // Optionally transform the user to replace the role with its name and remove totpSecret before returning
    user = await transformUser(user);
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
