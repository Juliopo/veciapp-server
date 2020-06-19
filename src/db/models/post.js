const mongoose = require('mongoose');

const { Schema } = mongoose;

const post = new Schema({
  title: String,
  description: String,
  time: String,
  media: String,
  departmentId: String,
  userId: String
});


module.exports = mongoose.model('post', post);
