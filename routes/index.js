/*TODO postRouter*/
// todoRouter
const userRouter = require('./users')
const authRouter = require('./auth')
const generalRouter = require('./general') // includes 404 missing routes

module.exports = (app) => {
  // app.use('/posts', postRouter),
  app.use('/auth', authRouter)
  app.use('/users', userRouter),
  app.use('/', generalRouter)
}
