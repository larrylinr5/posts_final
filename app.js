const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
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

app.use(cors());
app.use(logger("dev"));
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

/* 連線 */
require("./connections");
require("./routes")(app);

/* 錯誤處理 */
require("./utils/process");
const { appError, errorHandlerMainProcess } = require("./utils/errorHandler");
app.use((req, res, next) => {
  next(appError(404, "路由錯誤", "無此路由資訊"));
});
app.use(errorHandlerMainProcess);

module.exports = app;
