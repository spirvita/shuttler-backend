const express = require('express');
const authRouter = require('./auth');
const userRouter = require('./user');
const activityRouter = require('./activity');
const activitiesRouter = require('./activities');
const organizerRouter = require('./organizer');
const uploadRouter = require('./upload');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/activity', activityRouter);
router.use('/activities', activitiesRouter);
router.use('/organizer', organizerRouter);
router.use('/upload-image', uploadRouter);

module.exports = router;
