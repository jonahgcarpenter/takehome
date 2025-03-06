// Endpoints for authentication (login, logout, TOTP setup/verify)
const express = require("express");
const passport = require("passport");
const router = express.Router();
const authController = require("../controllers/authController");

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
  passport.authenticate("google", { failureRedirect: "/api/auth/failure" }),
  authController.googleCallback,
);

// logout route to destroy the session
router.get("/logout", authController.logout);

// failure route if the user fails to login
router.get("/failure", authController.failure);

module.exports = router;
