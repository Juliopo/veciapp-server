const User = require('../models/user');

exports.findUsersByEmail = email => (
  new Promise((resolve, reject) => {
    User.find({ email }, (err, user) => {
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
