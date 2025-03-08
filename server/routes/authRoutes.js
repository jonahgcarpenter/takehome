// Endpoints for authentication (login, logout, TOTP setup/verify)
const express = require("express");
const passport = require("passport");
const router = express.Router();
const authController = require("../controllers/authController");
const isAuthenticated = require("../middlewares/authMiddleware");
const isPartiallyAuthenticated = require("../middlewares/partialAuthMiddleware");

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

// TOTP routes for setting up and verifying 2FA (requires partial authentication)
router.get("/2fa/setup", isPartiallyAuthenticated, authController.totpSetup);
router.post("/2fa/verify", isPartiallyAuthenticated, authController.verifyTOTP);

// Logout route (requires authentication)
router.get("/logout", isAuthenticated, authController.logout);

// Failure route for unsuccessful login attempts
router.get("/failure", authController.failure);

module.exports = router;
