const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth');
const { authenticateLocal } = require('../../middlewares/auth');

router.post('/signup', authController.signUp);
router.post('/login', authenticateLocal, authController.login);
router.post('/logout', authController.logout);

module.exports = router;
