const express = require('express');
const authRouter = require('./auth');
const userRouter = require('./user');
const activityRouter = require('./activity');
const activitiesRouter = require('./activities');
const uploadRouter = require('./upload');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/activity', activityRouter);
router.use('/activities', activitiesRouter);
router.use('/upload-image', uploadRouter);

module.exports = router;
