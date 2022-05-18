const { appError } = require('../utils/errorHandler')
const passport = require('passport')

const authController = {
    google: {
        auth: (req, res, next) => {
            /* passport authenticate is a middleware */
            passport.authenticate('google', { 
                scope: ['profile', 'email']
            })(req, res, next)
        },
        execCallback: (req, res, next) => {
            passport.authenticate('google', {
                successRedirect: '/oauth',
                failureRedirect: '/',
            })(req, res, next)
        }
    }
}

module.exports = authController