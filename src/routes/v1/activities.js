const express = require('express');
const router = express.Router();
const activitiesController = require('../../controllers/activities');

router.get('/', activitiesController.getActivities);
router.get('/:activityId', activitiesController.getActivity);

module.exports = router;
