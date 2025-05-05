const express = require('express');
const authRouter = require('./auth');
const userRouter = require('./user');
const activityRouter = require('./activities');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/activities', activityRouter);

module.exports = router;
