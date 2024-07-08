import passport from 'passport';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../../models/UserModel.js";

export function useGoogleStrategy(){
    passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        scope: ["profile", "email"],
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          let user = await User.findOne({ googleId: profile.id });
  
          if (!user) {
            user = await User.create({
              googleId: profile.id,
              username: profile.displayName,
              email: profile.emails[0].value,
              image: profile.photos[0].value,
            });
          }
          return done(null, user);
        } catch (error) {
          console.log(error)
          return done(error, null);
        }
      }
    )
  );
  
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
        done(null, user);
  });

}