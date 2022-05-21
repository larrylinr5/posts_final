const { appError, handleErrorAsync } = require("../utils/errorHandler");
const { getHttpResponse } = require('../utils/successHandler');

const bcrypt = require('bcryptjs');
const validator = require('validator');
const { generateJwtToken } = require('../middleware/auth');

const User = require('../models/userModel);
const Follow = require('../models/followModel);

const users = {}

module.exports = users;