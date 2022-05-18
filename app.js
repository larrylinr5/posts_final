const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();

/** 跨網域套件 */
const cors =require('cors')
/** 載入 全域變數套件 */
const dotenv = require('dotenv');
// 全域變數套件設定
dotenv.config({ path: "./config.env" })

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* 啟用 Passport */
const passport = require('passport')
const session = require('express-session')
app.use(session({
    secret: process.env.SESSIONSECRET || 'dev',
    resave: 'false',
    saveUninitialized: 'false'
}))
app.use(passport.initialize())
app.use(passport.session())
require('./utils/passport')(passport)

/* 連線 */
require('./connections');
require('./routes')(app)

/* 錯誤處理 */
const { errorHandlerMainProcess } = require('./utils/errorHandler')
app.use(errorHandlerMainProcess)

// 程式出現重大錯誤
process.on('uncaughtException', (err) => {
    console.error('UnCaught Exception！')
    console.error(err)
    process.exit(1)
})
// 未捕捉到的 catch
process.on('unhandledRejection', (err, promise) => {
    console.error('未捕捉到的 rejection：', promise, '原因：', err)
})

module.exports = app;
