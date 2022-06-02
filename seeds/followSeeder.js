// postSeeder.js
/* connect to mongoDB */
const mongoose = require('mongoose');
const dbName = "metaWall"
const mongoDbLocalPort = "27017"
const localUrl = `mongodb://localhost:${mongoDbLocalPort}/${dbName}`
mongoose.connect(localUrl)
const db = mongoose.connection

/* load related model */
const Follow = require('../models/followModel')
/* load related json*/
const PostArray = require('./follows.json')

/* args */
const args = process.argv.slice(2);
const upDown = args[0]

db.once('open', () => {
    if (upDown === 'up') {
        Follow.create(PostArray)
            .then(() => {
                console.log('Generate Fallows from the seeder is done.')
                return db.close()
            })
            .catch(err => {
                console.log(err)
            })
    }

    if (upDown === 'down') {
        Follow.deleteMany({})
            .then(()=>{
                console.log('Cleaning all Seeder Fallows is done.')
                return db.close()
            })
            .catch(err => {
                console.log(err)
            })
    }
})
