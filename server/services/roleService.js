// Build and initialize roles in the database
const Role = require("../models/roleModel");

const initializeRoles = async () => {
  try {
    // Define default roles and their permissions
    const defaultRoles = [
      {
        name: "Admin",
      },
      {
        name: "Staff",
      },
      {
        name: "Customer",
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
