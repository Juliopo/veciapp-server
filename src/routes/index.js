const router = require('express').Router();
const authCtrl = require('../auth');

router.post('/signup', authCtrl.emailSignup);
router.post('/login', authCtrl.emailLogin);
router.get('/auth', authCtrl.ensureAuthenticated);

module.exports = router;
