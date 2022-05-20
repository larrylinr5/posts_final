const { appError, handleErrorAsync } = require("../utils/errorHandler");
const { getHttpResponse } = require('../utils/successHandler');

const validator = require('validator');

const User = require('../models/usersModel');
const Follow = require('../models/followsModel');

const follows = {}

module.exports = follows;