const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth');
const passport = require('passport');
const { authenticateLocal } = require('../../middlewares/auth');

router.post('/signup', authController.signUp);
router.post('/login', authenticateLocal, authController.login);

router.post('/logout', authController.logout);
// google Oauth2.0
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/healthcheck',
  }),
  authController.googleAuthCallback,
);

module.exports = router;
