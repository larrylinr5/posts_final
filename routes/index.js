/*TODO postRouter*/

const userRouter = require('./users')
const generalRouter = require('./general') // includes 404 missing routes

module.exports = (app) => {
  // app.use('/posts', postRouter),
  app.use('/users', userRouter),
  app.use('/', generalRouter)
}
