// Checks user roles and permissions

const hasRole = (roles) => {
  return (req, res, next) => {
    // Check if user is authenticated (cookie/session data is available)
    if (!req.user || !req.session.totpVerified) {
      return res.sendStatus(401);
    }
    // Check if user has a role and if that role's name is in the allowed list
    if (!req.user.role || !roles.includes(req.user.role.name)) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }
    next();
  };
};

module.exports = hasRole;
