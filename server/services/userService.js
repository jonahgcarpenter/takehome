// Business logic for user profile and permissions
const Role = require("../models/roleModel");

const initializeRoles = async () => {
  try {
    // Define default roles and their permissions
    const defaultRoles = [
      {
        name: "Admin",
        permissions: [
          "manage_all",
          "manage_users",
          "manage_roles",
          "manage_content",
        ],
      },
      {
        name: "Staff",
        permissions: ["manage_content"],
      },
      {
        name: "Customer",
        permissions: ["view_content"],
      },
    ];

    // For each role, find or create it
    for (const roleData of defaultRoles) {
      await Role.findOneAndUpdate({ name: roleData.name }, roleData, {
        upsert: true,
        new: true,
      });
    }
  } catch (error) {
    console.error("Error initializing roles:", error);
  }
};

module.exports = { initializeRoles };
