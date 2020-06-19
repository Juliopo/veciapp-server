const moment = require('moment');
const Post = require('../../db/models/post');

const { getAllPost, getPostById } = require('../../db/controllers/postController');

exports.getAllPosts = (req, res) => {
  const { auth } = req;

  if (!auth) {
    return res.status(403).send({ message: 'No auth' });
  }

  getAllPost(auth.departmentId).then((posts) => {
    if (!posts) {
      return res.status(403).send({
        message: 'No Posts were found'
      });
    }

    return res.send(posts);
  }).catch(() => res.status(500).send({ message: 'There was a problem finding post for this department' }));
};


exports.createPost = (req, res) => {
  const { title, description } = req.body;
  const { departmentId, userId } = req.auth;

  if (!departmentId || !userId) {
    return res.status(401).send({ message: 'Unauthorize please login again' });
  }

  const newPost = new Post();

  newPost.title = title;
  newPost.description = description;
  newPost.departmentId = departmentId;
  newPost.time = moment().toISOString();
  newPost.userId = userId;

  newPost.save().then(
    post => res.status(200).send(post),
    err => res.status(500).send({ message: err })
  ).catch(() => res.status(500).send('There was a problem creating a new Post'));
};


exports.getPost = (req, res) => {
  const { auth } = req;
  const { id } = req.params;

  if (!auth) {
    return res.status(403).send({ message: 'No auth' });
  }

  getPostById(id).then((post) => {
    if (!post) {
      return res.status(404).send({
        message: 'No Post were found'
      });
    }

    if (auth.departmentId !== post.departmentId) {
      return res.status(401).json({ message: 'This post does not belong to this department' });
    }

    return res.send(post);
  }).catch(() => res.status(500).json({ message: 'There was a problem finding post for this department' }));
};


exports.editPost = (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;
  const time = moment().toISOString();

  if (!req.auth) {
    return res.status(401).send({ message: 'Unauthorize please login again' });
  }

  if (!title || !description) {
    return res.status(400).send({ message: 'Please provide a title and description to change' });
  }

  Post.updateOne({ _id: id }, { title, description, time }).then(
    (post) => {
      if (post.nModified) {
        return res.status(200).send(post);
      }
      return res.status(400).json({ message: 'The new data could not be saved' });
    },
    err => res.status(500).send({ message: err })
  ).catch(() => res.status(500).send('There was a problem updating the Post'));
};


exports.deletePost = (req, res) => {
  const { id } = req.params;

  if (!req.auth) {
    return res.status(401).send({ message: 'Unauthorize please login again' });
  }

  Post.deleteOne({ _id: id }).then(
    post => res.status(200).send(post),
    err => res.status(500).send({ message: err })
  ).catch(() => res.status(500).send('There was a problem deleting the Post'));
};
