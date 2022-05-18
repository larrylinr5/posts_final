const { appError } = require('../utils/errorHandler')
const passport = require('passport')

const authController = {
    google: {
        auth: async (req, res, next) => {
            /* passport authenticate is a middleware */
            await passport.authenticate('google', { 
                scope: ['profile', 'email'],
                // session: false
            })(req, res, next)
        },
        execCallback: async (req, res, next) => {
            /*redirect path should be changed by frontend path*/
            passport.authenticate('google', {
                successRedirect: '/oauth',
                failureRedirect: '/',
                // session: false
            })(req, res, next)
            console.log('cookie', req.session)
            console.log('exec callback2', req?.user)
        }
    }
}

module.exports = authController