const logger = require("morgan");
const fileStreamRotator = require("file-stream-rotator");
// 生產環境日誌格式
const accessLogStream = fileStreamRotator.getStream({
  filename: "./log/access-%DATE%.log",
  frequency: "daily",
  verbose: false,
  date_format: "YYYYMMDD"
});
// 生產環境錯誤日誌格式
const accessLogStreamErr = fileStreamRotator.getStream({
  filename: "./log/access-err-%DATE%.log",
  frequency: "daily",
  verbose: false,
  date_format: "YYYYMMDD"
});

/**
 * @description 日誌格式
 * @param {TOKENS} tokens 
 * @param {REQUEST} req 
 * @param {RESPONSE} res 
 * @returns 
 */
function formatLog(tokens, req, res) {
  return [
    "-----------------------------------",
    "\nMETHOD=" + tokens.method(req, res),
    "STATUS=" + tokens.status(req, res),
    "URL="+decodeURI(tokens.url(req, res)),
    "響應時間="+tokens["response-time"](req, res), "ms",
    "\nREQUEST-BODY=" + JSON.stringify(req.body),
    "\nRESPONSE-BODY=" + res.__body_response,
    "\n-----------------------------------",
  ].join(" ");
}
// 生產環境log
const accessLog = (logger(function (tokens, req, res) {
  return formatLog(tokens, req, res);
}, {stream: accessLogStream}));
// 生產環境錯誤log
const accessLogErr = (logger(function (tokens, req, res) {
  return formatLog(tokens, req, res);
}, {
  stream: accessLogStreamErr,
  skip: function (req, res) {
    return res.statusCode < 400;
  }
}));
// 開發環境用log
const devLog = (logger(function (tokens, req, res) {
  return formatLog(tokens, req, res);
}));

module.exports = {accessLog, accessLogErr, devLog};
