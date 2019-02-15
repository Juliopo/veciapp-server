const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: String,
  password: String
});

userSchema.methods.encryptPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
userSchema.methods.comparePassword = password => bcrypt.compareSync(password, this.password);

module.exports = mongoose.model('user', userSchema);
