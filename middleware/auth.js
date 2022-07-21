const jwt = require("jsonwebtoken");
const { handleErrorAsync, appError } = require("../utils/errorHandler");
const User = require("../models/userModel");

const generateJwtToken = async function (userId = "") {
  let token = "";
  if (userId) {
    token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES
    });
  }
  return token;
};

const isAuth = handleErrorAsync(async (req, res, next) => {
  const { reset } = req.body;

  let token = "";

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(appError(400, "40003", "你尚未登入"));
  }

  const decoded = await new Promise((resolve, reject) => {
    if (reset) {
      jwt.verify(token, process.env.JWT_RESET_SECRET, (err, payload) => {
        err ? next(appError(400, "40003", "認證失敗，請重新點選連結")) : resolve(payload);
      });
    } else {
      jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        err ? next(appError(400, "40003", "Token 驗證錯誤")) : resolve(payload);
      });
    }

  });

  const currentUser = await User.findById(decoded.id);
  if (currentUser) {
    req.user = currentUser;
    next();
  } else {
    return next(appError(400, "40010", "使用者不存在"));
  }
});

module.exports = {
  isAuth,
  generateJwtToken
};