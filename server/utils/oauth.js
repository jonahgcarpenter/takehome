const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

//TODO: save user details to the database
// Configure the Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      return done(null, profile);
    },
  ),
);

// serialize and deserialize the user
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// Middleware to check if the user is isAuthenticated
const isAuthenticated = (req, res, next) => {
  req.user ? next() : res.sendStatus(401);
};

module.exports = isAuthenticated;
