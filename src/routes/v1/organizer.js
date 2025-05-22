const express = require('express');
const router = express.Router();
const organizerController = require('../../controllers/organizer');
const { authenticateJWT } = require('../../middlewares/auth');

router.put('/activity/:activityId', authenticateJWT, organizerController.updateActivity);

module.exports = router;
