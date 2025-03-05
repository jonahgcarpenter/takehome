const express = require("express");
const passport = require("passport");
const router = express.Router();

// login route using google strategy
router.get(
  "/login",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

// callback route after google has authenticated the user
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/api/auth/failure",
  }),
);

// logout route to destory the session
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy();
    res.redirect("/");
  });
});

// TODO: update to because this failure will be displayed in the frontend
// failure route if the user fails to login
router.get("/failure", (_req, res) => {
  res.send("Failed to login");
});

module.exports = router;
