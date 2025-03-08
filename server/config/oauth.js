// Passport configuration and OAuth strategy definitions
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("../models/userModel");
const Role = require("../models/roleModel");

// Configure the Google Strategy
// The first created user is Admin, while subsequent users are Customers by default
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        // Look for an existing user by their Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // Update user's information and last login date
          user.displayName = profile.displayName;
          user.firstName = profile.name.givenName;
          user.lastName = profile.name.familyName;
          user.profilePhoto =
            profile.photos && profile.photos[0]
              ? profile.photos[0].value
              : null;
          user.lastLogin = new Date();
          await user.save();
        } else {
          // Determine which role to assign
          const userCount = await User.countDocuments({});
          let roleName = userCount === 0 ? "Admin" : "Customer";

          // Retrieve the role document based on the determined role name
          const role = await Role.findOne({ name: roleName });
          if (!role) {
            return done(new Error(`${roleName} role not found.`));
          }

          // Create new user with the determined role
          user = await User.create({
            googleId: profile.id,
            email: profile.email,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            profilePhoto:
              profile.photos && profile.photos[0]
                ? profile.photos[0].value
                : null,
            role: role._id,
          });
        }

        // Pass the user object to the next middleware
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

// Serialize the user for the session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Deserialize the user from the session
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id).populate("role");
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
