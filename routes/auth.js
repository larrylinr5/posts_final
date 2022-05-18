const express = require('express')
const router = express.Router()
const authController = require('../controller/auth_controller')
const { appError, handleErrorAsync } = require('../utils/errorHandler')

router.get('/google', (req, res, next) => {
    /**
    *  #swagger.tags = ['Auth']
    */
    handleErrorAsync(authController.google.auth(req, res, next))
})

router.get('/google/callback', (req, res, next) => {
    /**
    *  #swagger.tags = ['Auth']
    */
    handleErrorAsync(authController.google.execCallback(req, res, next))
})

module.exports = router