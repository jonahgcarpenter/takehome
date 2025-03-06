// Checks user roles and permissions
const isAuthenticated = require("./authMiddelware");

const hasRole = (roles) => {
  return (req, res, next) => {
    // First, ensure the user is authenticated
    isAuthenticated(req, res, () => {
      // Now that req.user is guaranteed, check the role
      if (!req.user.role || !roles.includes(req.user.role.name)) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient permissions" });
      }
      next();
    });
  };
};

module.exports = hasRole;
