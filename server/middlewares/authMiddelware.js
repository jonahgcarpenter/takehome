// Contains functions like isAuthenticated to protect routes
const isAuthenticated = (req, res, next) => {
  if (req.user && req.session.totpVerified) {
    return next();
  }
  res.sendStatus(401);
};

module.exports = isAuthenticated;
