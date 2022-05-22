const express = require('express')
const router = express.Router()
const { appError } = require('../utils/errorHandler')

router.get('/', (req, res, next) => {
    /**
    *  #swagger.tags = ['Generals']
    */
    res.render('index', { title: 'Express' });
})

router.get('*', (req, res, next) => {
    /**
    *  #swagger.tags = ['Generals']
    */
    next(appError(404, "", 'Invalid Route'))
})

module.exports = router