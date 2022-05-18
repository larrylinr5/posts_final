const GoogleStrategy = require('passport-google-oauth2').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')

module.exports = (passport) =>{
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function (user, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
    /* register google strategy */
    passport.use(new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK,
            passReqToCallback: true
        }, async (req, accessToken, refreshToken, profile, done) => {
            console.log('profile', profile)
            const user = await User.findOne({email: profile._json.email})

            if(!user){
                const randomPassword = Math.random().toString(36).slice(-8)
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(randomPassword, salt, async (err, hash) => {
                        const newUser = await User.create({
                            nickName: profile._json.name,
                            email: profile._json.email,
                            password: hash
                        })

                        if(newUser){
                            req.user = user
                            return done(null, user)
                        }
                    })
                )
            }else{
                req.user = user
                return done(null, user)
            }

        })
    )

    
}