const { appError, handleErrorAsync } = require("../utils/errorHandler");
const { getHttpResponse } = require('../utils/successHandler');

const bcrypt = require('bcryptjs');
const validator = require('validator');
const { generateJwtToken } = require('../middleware/auth');

const User = require('../models/usersModel');
const Follow = require('../models/followsModel');

const users = {}

module.exports = users;