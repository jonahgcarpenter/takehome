// Handles authentication flows (Google OAuth, TOTP setup/verification, logout)
const qrcode = require("qrcode");
const authService = require("../services/authService");

// Called after successful Google OAuth authentication
exports.googleCallback = (req, res) => {
  // If the user hasn't set up TOTP at all, force them to the setup process
  if (!req.user.totpSecret) {
    return res.redirect("/api/auth/2fa/setup");
  }
  // If the user has a TOTP secret but hasn't verified it, prompt for token verification
  if (!req.user.totpEnabled) {
    return res.status(401).json({
      message: "Please finish your setup by verifying your 2FA code",
    });
  }

  // If the user hasn't completed 2FA verification for this session, prompt for token input
  if (!req.session.totpVerified) {
    return res.status(401).json({
      message: "Please enter your 2FA code",
    });
  }
  // If TOTP is set up and verified, allow access to protected routes
  res.redirect("/");
};

// TOTP Setup: Generate a secret, store it on the user, and return a QR code URL
exports.totpSetup = async (req, res) => {
  try {
    // Ensure the user is authenticated (middleware already does this)
    const user = req.user;

    // Generate a new TOTP secret for the user
    const secret = authService.generateTOTPSecret(user.email);

    // Save the secret in the user record
    user.totpSecret = secret.base32;
    await user.save();

    // Generate a QR code data URL for the otpauth URL
    const qrCodeDataURL = await qrcode.toDataURL(secret.otpauth_url);

    // Send QR code to the frontend (or render a view)
    res.json({
      message: "TOTP setup successful",
      qrCodeDataURL,
    });
  } catch (error) {
    console.error("Error in TOTP setup:", error);
    res.status(500).json({ message: "TOTP setup failed" });
  }
};

// TOTP Verification: Verify the token and enable TOTP for the user
exports.verifyTOTP = async (req, res) => {
  try {
    const user = req.user;
    const { token } = req.body;

    const isValid = authService.verifyTOTPToken(user, token);
    if (isValid) {
      // Mark TOTP as enabled
      user.totpEnabled = true;
      await user.save();

      // Mark the session as verified
      req.session.totpVerified = true;
      return res.redirect("/");
    }
    res.status(401).json({ message: "Invalid TOTP token" });
  } catch (error) {
    console.error("Error in TOTP verification:", error);
    res.status(500).json({ message: "TOTP verification failed" });
  }
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
