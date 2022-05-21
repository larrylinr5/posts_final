const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

router.post('/sign_up', (req, res, next) => {
  userController.signUp(req, res, next)
})
router.post('/sign_in', (req, res, next) => {
  userController.signIn(req, res, next)
})

module.exports = router
