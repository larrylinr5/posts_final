const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const { appError, handleErrorAsync } = require("../utils/errorHandler");
const { generateJwtToken } = require("../middleware/auth");

// Google Strategy
router.get(
  "/google",
  (req, res, next) => {
    /**
      * #swagger.ignore = true
      */
    authController.google.auth(req, res, next);
  }
);
router.get(
  "/google/callback",
  (req, res, next) => {
    authController.google.execCallback(req, res, next);
  },
  /**
    * #swagger.ignore = true
    */
  handleErrorAsync(async (req, res, next) => {
    if (req.user) {
      const token = await generateJwtToken(req.user.id); 

      if (token) {
        res.cookie("google-token", token);
        res.redirect(`${process.env.FRONTEND_REDIRECT_URL}?token=${token}&from=google`);
      } else {
        return next(appError("400", "40003", "無生成 Token 的權限"));
      }

    } else {
      return next(appError("401", "40001", "Google 認證錯誤"));
    }
  }));

router.get(
  "/discord",
  (req, res, next) => {
    /**
    * #swagger.ignore = true
    */
    authController.discord.auth(req, res, next);
  },
);

router.get(
  "/discord/callback",
  (req, res, next) => {
    authController.discord.execCallback(req, res, next);
  },
  /**
    * #swagger.ignore = true
    */
  handleErrorAsync(async (req, res, next) => {
    if (req.user) {
      const token = await generateJwtToken(req.user.id);

      if (token) {
        res.cookie("discord-token", token);
        res.redirect(`${process.env.FRONTEND_REDIRECT_URL}?token=${token}&from=discord`);
      } else {
        return next(appError("400", "40003", "無生成 Token 的權限"));
      }

    } else {
      return next(appError("401", "40001", "Discord 認證錯誤"));
    }
  }));

router.get(
  "/facebook",
  (req, res, next) => {
    /**
    * #swagger.ignore = true
    */
    authController.facebook.auth(req, res, next);
  },
);
  
router.get(
  "/facebook/callback",
  (req, res, next) => {
    authController.facebook.execCallback(req, res, next);
  },
  /**
    * #swagger.ignore = true
    */
  handleErrorAsync(async (req, res, next) => {
    if (req.user) {
      const token = await generateJwtToken(req.user.id);

      if (token) {
        res.cookie("facebook-token", token);
        res.redirect(`${process.env.FRONTEND_REDIRECT_URL}?token=${token}&from=facebook`);
      } else {
        return next(appError("400", "40003", "無生成 Token 的權限"));
      }

    } else {
      return next(appError("401", "40001", "Facebook 認證錯誤"));
    }
  }));

router.get(
  "/line",
  (req, res, next) => {
  /**
  * #swagger.ignore = true
  */
    authController.line.auth(req, res, next);
  },
);

router.get(
  "/line/callback",
  (req, res, next) => {
    authController.line.execCallback(req, res, next);
  },
  /**
    * #swagger.ignore = true
    */
  handleErrorAsync(async (req, res, next) => {
    if (req.user) {
      const token = await generateJwtToken(req.user.id);

      if (token) {
        res.cookie("line-token", token);
        res.redirect(`${process.env.FRONTEND_REDIRECT_URL}?token=${token}&from=line`);
      } else {
        return next(appError("400", "40003", "無生成 Token 的權限"));
      }

    } else {
      return next(appError("401", "40001", "Line 認證錯誤"));
    }
  }));

module.exports = router;