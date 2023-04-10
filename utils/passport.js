const GoogleStrategy = require("passport-google-oauth2").Strategy;
const DiscordStrategy = require("passport-discord").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const LineStrategy = require("passport-line").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const jwt = require('jsonwebtoken');

module.exports = (passport) => {
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (userId, done) {
    User.findById(userId, function (err, user) {
      done(err, user);
    });
  });
  /* register google strategy */
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK,
      },
      async (accessToken, refreshToken, profile, done) => {
        const user = await User.findOne({ email: profile._json.email });
        if (!user) {
          const randomPassword = Math.random().toString(36).slice(-8);
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(randomPassword, salt, async (err, hash) => {
              const newUser = await User.create({
                nickName: profile._json.name,
                email: profile._json.email,
                avatar: profile._json.picture || "",
                password: hash,
              });

              if (newUser) {
                return done(null, newUser);
              }
            })
          );
        } else {
          return done(null, user);
        }
      }
    )
  );

  passport.use(
    new DiscordStrategy(
      {
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: process.env.DISCORD_CALLBACK,
        scope: ["identify", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        const user = await User.findOne({ email: profile.email });
        if (!user) {
          const randomPassword = Math.random().toString(36).slice(-8);
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(randomPassword, salt, async (err, hash) => {
              const newUser = await User.create({
                nickName: profile.username,
                email: profile.email,
                avatar: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` || "",
                password: hash,
              });

              if (newUser) {
                return done(null, newUser);
              }
            })
          );
        } else {
          return done(null, user);
        }
      }
    )
  );

  passport.use(
    new LineStrategy(
      {
        channelID: process.env.LINE_CHANNEL_ID,
        channelSecret: process.env.LINE_CHANNEL_SECRET,
        callbackURL: process.env.LINE_CALLBACK,
        scope: ["profile", "openid", "email"],
        botPrompt: "normal",
        uiLocales: "zh-tw",
      },
      async (accessToken, refreshToken, params, profile, done) => {
        const { email } = jwt.decode(params.id_token);
        profile.email = email;
        const user = await User.findOne({ email: profile.email });
        if (!user) {
          const randomPassword = Math.random().toString(36).slice(-8);
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(randomPassword, salt, async (err, hash) => {
              const newUser = await User.create({
                nickName: profile.displayName,
                email: profile.email,
                avatar: profile.pictureUrl || "",
                password: hash,
              });

              if (newUser) {
                return done(null, newUser);
              }
            })
          );
        } else {
          return done(null, user);
        }
      }
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ["id", "emails", "displayName", "photos"],
      },
      async (accessToken, refreshToken, profile, done) => {
        const user = await User.findOne({ email: profile._json.email });
        if (!user) {
          const randomPassword = Math.random().toString(36).slice(-8);
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(randomPassword, salt, async (err, hash) => {
              const newUser = await User.create({
                nickName: profile._json.name,
                email: profile._json.email,
                avatar: profile._json.picture.data.url || "",
                password: hash,
              });

              if (newUser) {
                return done(null, newUser);
              }
            })
          );
        } else {
          return done(null, user);
        }
      }
    )
  );
};
