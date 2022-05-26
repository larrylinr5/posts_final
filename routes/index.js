const userRouter = require('./users')
const postRouter = require('./posts')
const authRouter = require('./auth')
const generalRouter = require('./general') // includes 404 missing routes
const { isAuth } = require('../middleware/auth')
const getHttpResponse = require('../utils/successHandler')
module.exports = (app) => {
  app.use('/users', userRouter),
  app.use('/posts', postRouter),
  app.use('/auth', authRouter),
  app.use('/check', isAuth, (req, res, next) => {
    res(getHttpResponse({ message: "驗證成功" }))
  })
  app.use('/', generalRouter)
}
