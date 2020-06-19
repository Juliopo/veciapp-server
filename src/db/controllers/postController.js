const Post = require('../models/post');

exports.getAllPost = departmentId => (
  new Promise((resolve, reject) => {
    Post.find({ departmentId }, (err, posts) => {
      if (err) reject(err);
      resolve(posts);
    });
  })
);

exports.getPostById = _id => (
  new Promise((resolve, reject) => {
    Post.findOne({ _id }, (err, post) => {
      if (err) reject(err);
      resolve(post);
    });
  })
);
