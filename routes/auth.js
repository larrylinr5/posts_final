const express = require('express')
const router = express.Router()
const authController = require('../controller/auth_controller')
const { appError, handleErrorAsync } = require('../utils/errorHandler')

router.get('/google', handleErrorAsync(authController.google.auth))
router.get('/google/callback', handleErrorAsync(authController.google.execCallback), handleErrorAsync (async (req, res, next) => {
    if(req.user){
        res.status(200)
            .json({
                status: 'success',
                data: {
                    user: req.user
                },
                message: 'Login via google successfully'
            })
    }else{
        res.status(401)
            .json({
                status: 'Error',
                data: {},
                message: 'Authorization via google error'
            })
    }
}))

module.exports = router