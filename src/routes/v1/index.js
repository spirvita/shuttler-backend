const express = require('express');
const authRouter = require('./auth');
const userRouter = require('./user');
const activityRouter = require('./activity');
const activitiesRouter = require('./activities');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/activity', activityRouter);
router.use('/activities', activitiesRouter);

module.exports = router;
