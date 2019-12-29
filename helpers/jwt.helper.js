require("dotenv").config({ path: "../.env" });
const expressJwt = require("express-jwt");
const userService = require("../services/user");

/**
 *  JWT Routing Configuratin
 */

const jwt = () => {
  return expressJwt({ secret: process.env.USER_AUTH_SECRET, isRevoked }).unless(
    {
      path: [
        // public routes that don't require authentication
        /^\/api\/users\/[a-f\d]*$/i,
        /^\/api\/resume\/[a-f\d]*$/i,
        "/api/requestInvite",
        "/api/users/auth",
        "/api/users/logout",
        "/api/users/current",
        "/api/hackathons",
        "/api/hackathons/add",
        "/api/leaderboard",
        "/api/users/verifyEmail",
        "/api/users/register",
        "/api/users/resetPassword",
        "/api/auth/facebook",
        "/api/auth/facebook/callback",
        "/api/auth/github",
        "/api/auth/github/callback",
        "/api/auth/google",
        "/api/auth/google/callback",
        "/api/auth/linkedin",
        "/api/auth/linkedin/callback"
      ]
    }
  );
};

/**
 *  Token Revocation Logic
 */

const isRevoked = async (req, payload, done) => {
  const user = await userService.getById(payload.sub);

  // revoke token if user no longer exists
  if (!user) {
    return done(null, true);
  }

  done();
};

module.exports = jwt;
