const { appError, handleErrorAsync } = require("../utils/errorHandler");
const { getHttpResponse } = require('../utils/successHandler');

const validator = require('validator');

const User = require('../models/userModel');
const Follow = require('../models/followModel');

const follows = {}

module.exports = follows;