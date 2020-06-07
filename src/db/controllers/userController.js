const User = require('../models/user');

exports.findUserByEmail = email => (
  new Promise((resolve, reject) => {
    User.findOne({ email }, (err, user) => {
      if (err) reject(err);
      resolve(user);
    });
  })
);

exports.findUserById = _id => (
  new Promise((resolve, reject) => {
    User.findOne({ _id }, (err, user) => {
      if (err) reject(err);
      resolve(user);
    });
  })
);
