// Handles authentication flows (Google OAuth, TOTP setup/verification, logout)

// Called after successful Google OAuth authentication
exports.googleCallback = (req, res) => {
  // At this point, Passport has set req.user; you can perform additional logic here if needed
  res.redirect("/protected");
};

// Handles user logout
exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });
};

// Returns an error response if authentication fails
exports.failure = (req, res) => {
  res.status(401).send("Failed to login");
};
