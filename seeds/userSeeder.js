// userSeeder.js
/* connect to mongoDB */
const mongoose = require('mongoose');
const localUrl = process.env.DATABASE
mongoose.connect(localUrl)
const db = mongoose.connection

/* load related model */
const User = require('../models/userModel')
/* load related json*/
const UserArray = require('./users.json')

/* args */
const args = process.argv.slice(2);
const upDown = args[0]

db.once('open', () => {
    if (upDown === 'up') {
        User.create(UserArray)
            .then(() => {
                console.log('Generate Users from the seeder is done.')
                return db.close()
            })
            .catch(err => {
                console.log(err)
            })
    }

    if (upDown === 'down') {
        User.deleteMany({})
            .then(() => {
                console.log('Cleaning all Seeder Users is done.')
                return db.close()
            })
            .catch(err => {
                console.log(err)
            })
    }
})

