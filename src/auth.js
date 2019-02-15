// auth.js
const jwt = require('jwt-simple');
const moment = require('moment');
const User = require('./db/models/user');
const tokenHelper = require('./token');
const config = require('./config');

exports.emailSignup = (req, res) => {
  const { email, password } = req.body;
  const newUser = new User();
  newUser.email = email;
  newUser.password = newUser.encryptPassword(password);

  User.findOne({ email }, (err, user) => {
    if (err) return res.status(500).send('There was a problem registering the user');

    if (user) {
      return res.status(403).send({
        message: 'email already in use'
      });
    }

    newUser.save().then(
      usr => res.status(200).send({ token: tokenHelper.createToken(usr._id) }),
      () => res.status(500).send({ message: err })
    );
  });
};

exports.emailLogin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err) return res.status(500).send({ message: 'There was a problem finding email user' });

    if (!user) {
      return res.status(404).send({ message: 'No User Found' });
    }
    if (!user.comparePassword(password)) {
      return res.status(401).send({ message: 'Incorrect password' });
    }

    return res.status(200).send({ token: tokenHelper.createToken(user) });
  });
};

exports.ensureAuthenticated = (req, res) => {
  if (!req.headers.authorization) {
    return res.status(403).send({ message: 'No auth' });
  }

  const token = req.headers['AUTH-TOKEN'] || req.headers.authorization || req.headers.Authorization || '';
  const payload = jwt.decode(token, config.TOKEN_SECRET);

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token expired' });
  }

  User.findOne({ _id: payload.sub }, (err, user) => {
    if (err) return res.status(500).send({ message: 'There was a problem finding id user' });
    if (!user) {
      return res.status(403).send({
        message: 'No user found with this token'
      });
    }

    return res.status(200).send({ message: 'succesfully loged' });
  });
};
