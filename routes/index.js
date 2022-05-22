const userRouter = require('./users')
const postRouter = require('./posts')
const likeRouter = require('./likes')
const authRouter = require('./auth')
const generalRouter = require('./general') // includes 404 missing routes

module.exports = (app) => {
  app.use('/users', userRouter),
  app.use('/posts', postRouter),
  app.use('/likes', likeRouter),
  app.use('/auth', authRouter),
  app.use('/', generalRouter)
}
