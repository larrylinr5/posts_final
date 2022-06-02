// postSeeder.js
/* connect to mongoDB */
const mongoose = require('mongoose');
const dbName = "metaWall"
const mongoDbLocalPort = "27017"
const localUrl = `mongodb://localhost:${mongoDbLocalPort}/${dbName}`
mongoose.connect(localUrl)
const db = mongoose.connection

/* load related model */
const Post = require('../models/postModel')
/* load related json*/
const PostArray = require('./posts.json')

/* args */
const args = process.argv.slice(2);
const upDown = args[0]

db.once('open', () => {
    if (upDown === 'up') {
        Post.create(PostArray)
            .then(() => {
                console.log('Generate Posts from the seeder is done.')
                return db.close()
            })
            .catch(err => {
                console.log(err)
            })
    }

    if (upDown === 'down') {
        Post.deleteMany({})
            .then(()=>{
                console.log('Cleaning all Seeder Posts is done.')
                return db.close()
            })
            .catch(err => {
                console.log(err)
            })
    }
})
