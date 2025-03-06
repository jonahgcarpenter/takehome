// Contains business logic for authentication & session management
const speakeasy = require("speakeasy");

/**
 * Generate a TOTP secret for a user.
 * Returns the secret object containing base32 secret and otpauth URL.
 */
const generateTOTPSecret = (userEmail) => {
  const secret = speakeasy.generateSecret({
    length: 20,
    name: `MyApp (${userEmail})`,
    issuer: "MyApp",
  });
  return secret;
};

/**
 * Verify a TOTP token against the user's stored secret.
 * @param {Object} user - The user object (must have totpSecret).
 * @param {String} token - The token entered by the user.
 * @returns {Boolean} - True if valid; false otherwise.
 */
const verifyTOTPToken = (user, token) => {
  if (!user || !user.totpSecret) {
    throw new Error("TOTP is not set up for this user.");
  }
  return speakeasy.totp.verify({
    secret: user.totpSecret,
    encoding: "base32",
    token,
    window: 1, // Allows a small time window for token drift
  });
};

module.exports = {
  generateTOTPSecret,
  verifyTOTPToken,
};
