const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const { appError, handleErrorAsync } = require("../utils/errorHandler");
const { generateJwtToken } = require("../middleware/auth");

// Google Strategy
router.get("/google", handleErrorAsync(authController.google.auth));
router.get("/google/callback", handleErrorAsync(authController.google.execCallback), handleErrorAsync (async (req, res, next) => {
  if(req.user){
    const token = await generateJwtToken(req.user.id);

    if(token){
      res.cookie("google-token", token);
      res.redirect(`${process.env.FRONTEND_REDIRECT_URL}?token=${token}`);
    }else{
      return next(appError("400", "40003", "No permission to generate token"));
    }

  }else{
    res.status(401)
      .json({
        status: "Error",
        data: {},
        message: "Authorization via google error"
      });
  }
}));

module.exports = router;