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

// TOTP setup route: generates a secret and returns a QR code for the user to scan
router.get("/2fa/setup", authController.totpSetup);

// TOTP verification route: user posts token for verification
router.post("/2fa/verify", authController.verifyTOTP);

// Logout route
router.get("/logout", authController.logout);

// Failure route for unsuccessful login attempts
router.get("/failure", authController.failure);

module.exports = router;
