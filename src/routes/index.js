const router = require('express').Router();
const { emailSignup, emailLogin, authMiddleware } = require('../controllers/auth');
const {
  getAllPosts, createPost, getPost, editPost, deletePost
} = require('../controllers/post');

router.post('/signup', emailSignup);
router.post('/login', emailLogin);
router.get('/auth', authMiddleware, (req, res) => res.send(req.auth));

// Posts
router.get('/post', authMiddleware, getAllPosts);
router.get('/post/:id', authMiddleware, getPost);
router.put('/post/:id', authMiddleware, editPost);
router.delete('/post/:id', authMiddleware, deletePost);
router.post('/post', authMiddleware, createPost);


module.exports = router;
