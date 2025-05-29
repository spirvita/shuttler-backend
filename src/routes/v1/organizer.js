const express = require('express');
const router = express.Router();
const organizerController = require('../../controllers/organizer');
const { authenticateJWT } = require('../../middlewares/auth');

router.get('/activities', authenticateJWT, organizerController.getActivities);
router.get('/activities/:activityId', authenticateJWT, organizerController.getActivity);
router.put('/activity/:activityId', authenticateJWT, organizerController.updateActivity);
router.post('/activity/:activityId/suspend', authenticateJWT, organizerController.suspendActivity);

module.exports = router;
