// services.js
const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('./config');

exports.createToken = (user, departmentId) => {
  const payload = {
    email: user.email,
    userId: user.id,
    role: user.role,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix(),
    departmentId
  };

  return jwt.encode(payload, config.TOKEN_SECRET);
};
