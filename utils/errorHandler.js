// 自定義 error
const appError = (statusCode, errName, errMessage, next) => {
    const error = new Error(errMessage)
    error.name = errName
    error.statusCode = statusCode
    error.isOperational = true
    next(error)
}

// async func catch
const handleErrorAsync = function (func) {
    return function (req, res, next) {
        func(req, res, next).catch(
            function (error) {
                return next(error)
            }
        )
    }
}

// Dev 環境下的錯誤 
const resErrorDev = (err, res) => {
    res.status(err.statusCode)
        .json({
            message: err.message,
            error: err,
            stack: err.stack
        })
}

// Prod 環境下，自己設定的 err 錯誤 
const resErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode)
            .json({
                message: err.message,
            })
    } else {
        console.error('出現重大錯誤', err)
        res.status(err.statusCode)
            .json({
                status: 'error',
                message: '系統錯誤，請洽系統管理員'
            })
    }
}

const errorHandlerMainProcess = (err, req, res, next) => {
    if (err) {
        err.statusCode = err.statusCode || 500;
        // dev
        if (process.env.NODE_ENV === 'dev') {
            return resErrorDev(err, res)
        }
        // production
        if (err.name === 'ValidationError') {
            err.message = "資料欄位未填寫正確，請重新輸入！"
            err.isOperational = true;
            return resErrorProd(err, res)
        }
        resErrorProd(err, res)
    }
}

module.exports = {
    errorHandlerMainProcess,
    appError,
    resErrorDev,
    resErrorProd,
    handleErrorAsync
}