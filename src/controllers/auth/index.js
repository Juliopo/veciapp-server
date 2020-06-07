// auth.js
const jwt = require('jwt-simple');
const moment = require('moment');
const { isArray, isEmpty, includes } = require('lodash');

const User = require('../../db/models/user');
const tokenHelper = require('../../token');
const config = require('../../config');
const { findUserByEmail, findUserById } = require('../../db/controllers/userController');

exports.emailSignup = (req, res) => {
  const {
    email, password, departments, role
  } = req.body;

  if (!email || !password || isEmpty(departments) || !role) {
    return res.status(400).send({ message: 'one of email, password, departmentID or role is not provided' });
  }

  if (!isArray(departments)) {
    return res.status(400).send({ message: 'departmetId should be an array of strings' });
  }

  const newUser = new User();
  newUser.email = email;
  newUser.password = newUser.encryptPassword(password);
  newUser.departments = departments;
  newUser.role = role;

  findUserByEmail(email)
    .then((user) => {
      if (user) {
        return res.status(403).send({
          message: 'email already in use, or password already in use in another department'
        });
      }

      newUser.save().then(
        usr => res.status(200).send({ token: tokenHelper.createToken(usr, usr.departments[0]) }),
        err => res.status(500).send({ message: err })
      );
    })
    .catch(() => res.status(500).send('There was a problem registering the user'));
};

exports.emailLogin = (req, res) => {
  const { email, password, departmentId } = req.body;

  findUserByEmail(email)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'No User Found' });
      }

      if (isEmpty(departmentId)) {
        res.status(400).send({ message: 'one of email, password or departmentID is not provided' });
      }
      const hasDepartmentId = includes(user.departments, departmentId);

      if (!hasDepartmentId) {
        res.status(401).send({ message: 'There is not department associated with this account' });
      }

      if (!user.comparePassword(`${password}`)) {
        return res.status(401).send({ message: 'Incorrect password' });
      }
      const token = tokenHelper.createToken(user, departmentId);

      return res.status(200).send({ token });
    })
    .catch(err => res.status(500).send({ message: err }));
};

exports.ensureAuthenticated = (req, res) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(403).send({ message: 'No auth' });
  }

  const token = auth || '';
  const payload = jwt.decode(token, config.TOKEN_SECRET);

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token expired' });
  }

  findUserById({ _id: payload.userId }).then((user) => {
    if (!user) {
      return res.status(403).send({
        message: 'No user found with this token'
      });
    }

    return res.status(200).send(payload);
  }).catch(() => res.status(500).send({ message: 'There was a problem finding id user' }));
};
