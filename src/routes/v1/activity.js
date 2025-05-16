const express = require('express');
const router = express.Router();
const activityController = require('../../controllers/activity');
const { authenticateJWT, optionalAuthenticateJWT } = require('../../middlewares/auth');

router.get('/upcoming', optionalAuthenticateJWT, activityController.upcomingActivities);
router.get('/popular', optionalAuthenticateJWT, activityController.popularActivities);
router.post('/favorites', authenticateJWT, activityController.addFavoriteActivities);
router.delete(
  '/favorites/:activityId',
  authenticateJWT,
  activityController.deleteFavoriteActivities,
);

module.exports = router;
