const { appError, handleErrorAsync } = require("../utils/errorHandler");
const { getHttpResponse } = require('../utils/successHandler');

const validator = require('validator');

const User = require('../models/userModel');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

const posts = {}

module.exports = posts;