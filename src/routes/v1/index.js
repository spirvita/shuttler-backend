const express = require('express');
const authRouter = require('./auth');
const userRouter = require('./user');
const activityRouter = require('./activity');
const activitiesRouter = require('./activities');
const organizerRouter = require('./organizer');
const uploadRouter = require('./upload');
const pointsRouter = require('./points');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/activity', activityRouter);
router.use('/activities', activitiesRouter);
router.use('/organizer', organizerRouter);
router.use('/upload-image', uploadRouter);
router.use('/points', pointsRouter);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: 伺服器錯誤
 *   responses:
 *     NotFound:
 *       description: 找不到路由
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *             message: 無此路由
 *     ServerError:
 *       description: 伺服器錯誤
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *             message: 伺服器錯誤
 */
