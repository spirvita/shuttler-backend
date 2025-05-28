const express = require('express');
const router = express.Router();
const activitiesController = require('../../controllers/activities');
const { optionalAuthenticateJWT } = require('../../middlewares/auth');

router.get('/', activitiesController.getActivities);
router.get('/:activityId', optionalAuthenticateJWT, activitiesController.getActivity);

module.exports = router;
