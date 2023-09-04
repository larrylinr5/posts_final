const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("./utils/logger");
/** 跨網域套件 */
const cors = require("cors");

/** 載入 全域變數套件 */
const dotenv = require("dotenv");
// 全域變數套件設定
if (process.env.NODE_ENV === "dev") {
  dotenv.config({ path: "./local.env" });
} else {
  dotenv.config({ path: "./config.env" });
}

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/* 啟用 Passport */
const passport = require("passport");
const session = require("express-session");
app.use(session({
  secret: process.env.SESSIONSECRET || "dev",
  resave: "false",
  saveUninitialized: "false"
}));
app.use(passport.initialize());
app.use(passport.session());
require("./utils/passport")(passport);
app.use(function (req, res, next) {
  const originalSend = res.send;
  res.send = function (body) { // res.send() 和 res.json() 都會攔截到
    res.__body_response = body;
    originalSend.call(this, body);
  };
  next();
});

/* logger */
// 必須在 routes 前面
// if (process.env.NODE_ENV === "dev"){
app.use(logger.devLog);
// 開發環境日誌不保存
// }else {
//   // 生產環境 - heroku 無法使用暫時先 comment out
//   app.use(logger.accessLog);
//   app.use(logger.accessLogErr);
// }


/* 連線 */
require("./connections");
require("./routes")(app);

/* 錯誤處理 */
require("./utils/process");
const { appError, errorHandlerMainProcess } = require("./utils/errorHandler");
app.use((req, res, next) => {
  next(appError(404, "40401", "無此路由資訊"));
});
app.use(errorHandlerMainProcess);

module.exports = app;
