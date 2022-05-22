const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const { handleErrorAsync } = require('../utils/errorHandler');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

router.post('/sign_up', handleErrorAsync(async (req, res, next) => {
  userController.signUp(req, res, next)
}))
router.post('/sign_in', handleErrorAsync(async (req, res, next) => {
  userController.signIn(req, res, next)
}))

module.exports = router
