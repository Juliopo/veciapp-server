// auth.js
const jwt = require('jwt-simple');
const moment = require('moment');
const User = require('../../db/models/user');
const tokenHelper = require('../../token');
const config = require('../../config');
const { findUsersByEmail, findUserById } = require('../../db/controllers/userController');

exports.emailSignup = (req, res) => {
  const {
    email, password, departmentId, role
  } = req.body;

  if (!email || !password || !departmentId || !role) {
    return res.status(400).send({ message: 'one of email, password, departmentID or role is not provided' });
  }

  const newUser = new User();
  newUser.email = email;
  newUser.password = newUser.encryptPassword(password);
  newUser.departmentId = departmentId;
  newUser.role = role;

  findUsersByEmail(email)
    .then((users) => {
      const usersFound = users && users.find((user) => {
        return user.departmentId === departmentId || user.comparePassword(`${password}`);
      });

      if (usersFound) {
        return res.status(403).send({
          message: 'email already in use, or password already in use in another department'
        });
      }

      newUser.save().then(
        usr => res.status(200).send({ token: tokenHelper.createToken(usr._id) }),
        err => res.status(500).send({ message: err })
      );
    })
    .catch(() => res.status(500).send('There was a problem registering the user'));
};

exports.emailLogin = (req, res) => {
  const { email, password, departmentId } = req.body;

  findUsersByEmail(email)
    .then((users) => {
      if (!departmentId) {
        res.status(400).send({ message: 'one of email, password or departmentID is not provided' });
      }
      const curentUser = users && users.find(
        user => user.departmentId === departmentId
      );
      
      if (!curentUser) {
        return res.status(404).send({ message: 'No User Found' });
      }

      if (!curentUser.comparePassword(`${password}`)) {
        return res.status(401).send({ message: 'Incorrect password' });
      }
      const token = tokenHelper.createToken(curentUser._id);

      return res.status(200).send({ token });
    })
    .catch(err => res.status(500).send({ message: err }));
};

exports.ensureAuthenticated = (req, res) => {
  const auth = req.cookies.Authorization;

  if (!auth) {
    return res.status(403).send({ message: 'No auth' });
  }

  const token = auth || '';
  const payload = jwt.decode(token, config.TOKEN_SECRET);

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token expired' });
  }

  findUserById({ _id: payload.sub }).then((user) => {
    if (!user) {
      return res.status(403).send({
        message: 'No user found with this token'
      });
    }

    return res.status(200).send({ message: 'succesfully loged' });
  }).catch(() => res.status(500).send({ message: 'There was a problem finding id user' }));
};
