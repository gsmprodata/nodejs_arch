require("dotenv").config({ path: "../.env" });
//require("babel-polyfill");
const userService = require("../services/user");
const routerAsyncWrap = require("../helpers/async_wrapper");
const requestImageSize = require("request-image-size");
const router = require("express").Router();
const passport = require("passport");
const User = require("../models/user");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;

passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      async (req, email, password, done) => {
        let user = await userService.authenticate({
          email,
          password,
          isSocialLogin: false,
          socialProvider: null,
          socialId: null
        });
        if (!user || user.isDeactivated == true)
          return done(null, false, req.flash("error", "Login Failed"));
        return done(null, user);
      }
    )
  );
  
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FB_APP_ID,
        clientSecret: process.env.FB_APP_SECRET,
        callbackURL: `${process.env.APP_URL}/api/auth/facebook/callback`,
        profileFields: ["id", "emails", "name", "link", "photos"],
        passReqToCallback: true
      },
      async (req, accessToken, refreshToken, profile, done) => {
        let notInvited;
        if (!(await User.findOne({ email: profile.emails[0].value }))) {
          notInvited = true;
        } else if (await User.findOne({ email: profile.emails[0].value })) {
          const existingProfile = await User.findOne({
            email: profile.emails[0].value
          });
          let imgSize = await requestImageSize(profile.photos[0].value);
          await userService.update(existingProfile._id, {
            facebookUrl: profile.profileUrl,
            facebookId: profile.id,
            profileImageUrl:
              imgSize.height >= 100 && imgSize.width >= 100
                ? profile.photos[0].value
                : existingProfile.profileImageUrl
                  ? existingProfile.profileImageUrl
                  : ""
          });
        }
        if (notInvited)
          return done(
            null,
            false,
            req.flash("error", profile.emails[0].value + " Not Invited")
          );
        profile = await userService.authenticate({
          email: profile.emails[0].value,
          isSocialLogin: true,
          socialProvider: "facebook",
          password: "",
          socialId: String(profile.id)
        });
        if (!profile || profile.isDeactivated == true)
          return done(null, false, req.flash("error", "Login Failed"));
        return done(null, profile);
      }
    )
  );
  
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GH_CLIENT_ID,
        clientSecret: process.env.GH_CLIENT_SECRET,
        callbackURL: `${process.env.APP_URL}/api/auth/github/callback`,
        passReqToCallback: true
      },
      async (req, accessToken, refreshToken, profile, done) => {
        let notInvited;
        if (!(await User.findOne({ email: profile.emails[0].value }))) {
          notInvited = true;
        } else if (await User.findOne({ email: profile.emails[0].value })) {
          const existingProfile = await User.findOne({
            email: profile.emails[0].value
          });
          let imgSize = await requestImageSize(profile.photos[0].value);
          await userService.update(existingProfile._id, {
            githubUrl: profile.profileUrl,
            githubId: profile.id,
            githubUsername: profile._json.login,
            profileImageUrl:
              imgSize.width >= 100 && imgSize.height >= 100
                ? profile.photos[0].value
                : existingProfile.profileImageUrl
                  ? existingProfile.profileImageUrl
                  : ""
          });
        }
        if (notInvited)
          return done(
            null,
            false,
            req.flash("error", profile.emails[0].value + " Not Invited")
          );
        profile = await userService.authenticate({
          email: profile.emails[0].value,
          isSocialLogin: true,
          socialProvider: "github",
          password: "",
          socialId: String(profile.id)
        });
        if (!profile || profile.isDeactivated == true)
          return done(null, false, req.flash("error", "Login Failed"));
        return done(null, profile);
      }
    )
  );
  
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.APP_URL}/api/auth/google/callback`,
        passReqToCallback: true
      },
      async (req, accessToken, refreshToken, profile, done) => {
        let notInvited = false;
        if (!(await User.findOne({ email: profile.emails[0].value }))) {
          notInvited = true;
        } else if (await User.findOne({ email: profile.emails[0].value })) {
          const existingProfile = await User.findOne({
            email: profile.emails[0].value
          });
          let imgSize = await requestImageSize(profile.photos[0].value);
          await userService.update(existingProfile._id, {
            googleId: profile.id,
            profileImageUrl:
              imgSize.width >= 100 && imgSize.height >= 100
                ? profile.photos[0].value
                : existingProfile.profileImageUrl
                  ? existingProfile.profileImageUrl
                  : ""
          });
        }
        if (notInvited)
          return done(
            null,
            false,
            req.flash("error", profile.emails[0].value + " Not Invited")
          );
        profile = await userService.authenticate({
          email: profile.emails[0].value,
          isSocialLogin: true,
          socialProvider: "google",
          password: "",
          socialId: String(profile.id)
        });
        if (!profile || profile.isDeactivated == true)
          return done(null, false, req.flash("error", "Login Failed"));
        return done(null, profile);
      }
    )
  );
  
  passport.use(
    new LinkedInStrategy(
      {
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: `${process.env.APP_URL}/api/auth/linkedin/callback`,
        scope: ["r_emailaddress", "r_liteprofile"],
        profileFields: ["id", "name", "emails"],
        passReqToCallback: true
      },
      async (req, accessToken, refreshToken, profile, done) => {
        let notInvited;
        if (!(await User.findOne({ email: profile.emails[0].value }))) {
          notInvited = true;
        } else if (await User.findOne({ email: profile.emails[0].value })) {
          const existingProfile = await User.findOne({
            email: profile.emails[0].value
          });
          let imgSize = await requestImageSize(profile.photos[0].value);
          await userService.update(existingProfile._id, {
            linkedinId: profile.id,
            profileImageUrl:
              imgSize.width >= 100 && imgSize.height >= 100
                ? profile.photos[0].value
                : existingProfile.profileImageUrl
                  ? existingProfile.profileImageUrl
                  : ""
          });
        }
        if (notInvited)
          return done(
            null,
            false,
            req.flash("error", profile.emails[0].value + " Not Invited")
          );
        profile = await userService.authenticate({
          email: profile.emails[0].value,
          isSocialLogin: true,
          socialProvider: "linkedin",
          password: "",
          socialId: profile.id
        });
        if (!profile || profile.isDeactivated == true)
          return done(null, false, req.flash("error", "Login Failed"));
        return done(null, profile);
      }
    )
  );


  /**
 * Social Logins
 */

// Facebook Login
router.route("/auth/facebook").get(
  passport.authenticate("facebook", {
    scope: ["email", "user_link"]
  })
);
router.route("/auth/facebook/callback").get(
  passport.authenticate("facebook", {
    scope: ["email", "user_link"],
    successRedirect: "/dashboard?provider=facebook",
    failureFlash: true,
    failureRedirect: "/login?error=oauthfailure"
  }),
  (error, req, res, next) => {
    if (error) {
      console.log(error);
      res.redirect("/login?error=oauthfailure");
    }
  }
);

// GitHub authentication
router.route("/auth/github").get(passport.authenticate("github"));
router.route("/auth/github/callback").get(
  passport.authenticate("github", {
    successRedirect: "/dashboard?provider=github",
    failureFlash: true,
    failureRedirect: "/login?error=oauthfailure"
  }),
  (error, req, res, next) => {
    if (error) res.redirect("/login?error=oauthfailure");
  }
);

// Google Authentication
router
  .route("/auth/google")
  .get(passport.authenticate("google", { scope: "openid email profile" }));
router.route("/auth/google/callback").get(
  passport.authenticate("google", {
    successRedirect: "/dashboard?provider=google",
    scope: "openid email profile",
    failureFlash: true,
    failureRedirect: "/login?error=oauthfailure"
  }),
  (error, req, res, next) => {
    if (error) res.redirect("/login?error=oauthfailure");
  }
);

// LinkedIn Authentication
router.route("/auth/linkedin").get(
  passport.authenticate("linkedin", {
    scope: ["r_emailaddress", "r_liteprofile"]
  })
);
router.route("/auth/linkedin/callback").get(
  passport.authenticate("linkedin", {
    scope: ["r_emailaddress", "r_liteprofile"],
    successRedirect: "/dashboard?provider=linkedin",
    failureFlash: true,
    failureRedirect: "/login?error=oauthfailure"
  })
);

module.exports = router;