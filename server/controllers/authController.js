// Handles authentication flows (Google OAuth, TOTP setup/verification, logout)
const qrcode = require("qrcode");
const authService = require("../services/authService");

const BASE_URL = process.env.FRONTEND_BASE_URL || "";

// Called after successful Google OAuth authentication
exports.googleCallback = (req, res) => {
  // If the user hasn't set up TOTP at all, redirect to the setup page
  if (!req.user.totpSecret) {
    return res.redirect(`${BASE_URL}/2fa/setup`);
  }
  // If the user has a TOTP secret but hasn't verified it, redirect to verification page
  if (!req.user.totpEnabled || !req.session.totpVerified) {
    return res.redirect(`${BASE_URL}/2fa/verify`);
  }
  // If TOTP is set up and verified, redirect to dashboard
  res.redirect(`${BASE_URL}/dashboard`);
};

// GET /api/auth/2fa/setup
// Generate a secret, store it on the user, and return a QR code URL
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

    // We still need to send the QR code data to the frontend
    res.status(200).json({
      qrCodeDataURL,
    });
  } catch (error) {
    console.error("Error in TOTP setup:", error);
    res.status(500).json({ message: "TOTP setup failed" });
  }
};

// POST /api/auth/2fa/verify
// Verify the token and enable TOTP for the user
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

      // Redirect to dashboard after successful verification
      return res.redirect(`${BASE_URL}/dashboard`);
    }
    // In case of invalid token, send back to verification page with error
    res.status(401).json({ message: "Invalid TOTP token" });
  } catch (error) {
    console.error("Error in TOTP verification:", error);
    res.status(500).json({ message: "TOTP verification failed" });
  }
};

// GET /api/auth/logout
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
      // Redirect to login after successful logout
      return res.redirect(`${BASE_URL}/`);
    });
  });
};

// GET /api/auth/failure
// Returns an error response if authentication fails
exports.failure = (req, res) => {
  res.status(401).send("Failed to login");
};
