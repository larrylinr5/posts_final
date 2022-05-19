var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
/** 跨網域套件 */
var cors =require('cors')

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* 連線 */
require('./routes')(app)
require('./connections');

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
console.log('test')
module.exports = app
