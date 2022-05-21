const { appError, handleErrorAsync } = require("../utils/errorHandler");
const { getHttpResponse } = require('../utils/successHandler');

const validator = require('validator');

const User = require('../models/usersModel');
const Post = require('../models/postsModel');
const Comment = require('../models/commentsModel');

const posts = {}

module.exports = posts;