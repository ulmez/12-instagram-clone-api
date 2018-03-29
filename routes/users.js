const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/checkAuth');

const UsersController = require('../controllers/usersController');

router.post('/auth', UsersController.authenticate);
router.post('/user/:id', checkAuth, UsersController.get_specific_user);
router.post('/register', UsersController.register_new_user);
router.post('/login', UsersController.login_user);
router.post('/logout', checkAuth, UsersController.logout_user);

module.exports = router;