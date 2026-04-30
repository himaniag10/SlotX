const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://slotx.onrender.com/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email  = profile.emails[0].value;
        const name   = profile.displayName;
        const avatar = profile.photos[0]?.value;

        // If user already exists (returning user)
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        // If email already registered locally, link Google to it
        user = await User.findOne({ email });
        if (user) {
          user.googleId     = profile.id;
          user.avatar       = avatar;
          user.authProvider = "google";
          await user.save();
          return done(null, user);
        }

        // Brand new user — always student by default
        user = await User.create({
          googleId:     profile.id,
          email,
          name,
          avatar,
          role:         "student",
          authProvider: "google",
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;