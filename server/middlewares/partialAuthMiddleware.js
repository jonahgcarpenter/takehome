// Check if user is partially authenticated (via OAuth only)
// Only used for 2FA setup and verification routes
const isPartiallyAuthenticated = (req, res, next) => {
  if (req.user) {
    return next();
  }
  res.sendStatus(401);
};

module.exports = isPartiallyAuthenticated;
