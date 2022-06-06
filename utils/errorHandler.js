// 自定義 error
/**
 * @description - 負責將所以API的錯誤統一並回傳統一error格式
 * @param {Number} statusCode
 * @param {String} errName
 * @param {String} errMessage
 */
const appError = (statusCode, errName, errMessage) => {
  const error = new Error(errMessage);
  error.name = errName;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

// async func catch
/**
 *
 * @description - 用來擷取系統錯誤
 * @param {Function} func - controller function
 * @return {Next} - 回傳express Next
 */
const handleErrorAsync = function (func) {
  return function (req, res, next) {
    func(req, res, next).catch(
      function (error) {
        return next(error);
      }
    );
  };
};

// Dev 環境下的錯誤
const resErrorDev = (err, res) => {
  res.status(err.statusCode)
    .json({
      status: "false",
      message: err.message,
      error: err,
      stack: err.stack
    });
};
/**
 * @description - 用來切換是系統錯誤還是自定義錯誤的status值
 * @param {Error} {statusCode} - error response 用的 statusCode
 * @return {'false'|'error'} - 回傳值 'false' or 'error'
 */
const resErrorStatus = ({statusCode}) => {
  if(statusCode===500){
    return "error";
  }
  return "false";
};


// Prod 環境下，自己設定的 err 錯誤
const resErrorProd = (err, res) => {
  const resErrorData = {
    status: "",
    message: "",
    error: {
      name: ""
    }
  };
  resErrorData.status = resErrorStatus(err);
  if (err.isOperational) {
    resErrorData.message = err.message;
    resErrorData.error.name = err.name;
    res.status(err.statusCode)
      .json(resErrorData);
  } else {
    console.error("出現重大錯誤", err);
    resErrorData.message = "系統錯誤，請洽系統管理員";
    res.status(err.statusCode)
      .json(resErrorData);
  }
};

const errorHandlerMainProcess = (err, req, res, next) => {
  if (err) {
    err.statusCode = err.statusCode || 500;
    // dev
    if (process.env.NODE_ENV === "dev") {
      return resErrorDev(err, res);
    }
    // production
    if (err.name === "ValidationError") {
      err.message = "資料欄位未填寫正確，請重新輸入！";
      err.isOperational = true;
      return resErrorProd(err, res);
    }
    resErrorProd(err, res);
  }
};

module.exports = {
  errorHandlerMainProcess,
  appError,
  resErrorDev,
  resErrorProd,
  handleErrorAsync
};