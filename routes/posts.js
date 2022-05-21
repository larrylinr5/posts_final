const express = require('express');
const router = express.Router();
const PostController = require('../controller/postController');
const { isAuth } = require('../middleware/auth')

module.exports = router;