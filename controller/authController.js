const { appError } = require("../utils/errorHandler");
const passport = require("passport");

const authController = {
  google: {
    auth: async (req, res, next) => {
      /* passport authenticate is a middleware */
      passport.authenticate("google", { 
        scope: ["profile", "email"]
      })(req, res, next);
    },
    execCallback: async (req, res, next) => {
      passport.authenticate("google")(req, res, next);
    }
  }
};

module.exports = authController;