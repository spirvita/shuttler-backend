const express = require('express');
const router = express.Router();
const pointsController = require('../../controllers/points');
// const { authenticateJWT } = require('../../middlewares/auth');

// router.post('/purchase', authenticateJWT, pointsController.purchasePoints);
router.get('/', pointsController.getPoints);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Points
 *   description: 購買點數
 */

/**
 * @swagger
 * /api/v1/points/plan:
 *   get:
 *     security: []
 *     tags: [Points]
 *     summary: 查看點數方案
 *     description: 查看點數方案
 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "成功"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       points:
 *                         type: integer
 *                         example: 100
 *                       value:
 *                         type: number
 *                         format: integer
 *                         example: 100
 *       400:
 *         description: 請求參數錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               noData:
 *                 summary: 點數資料不存在
 *                 value:
 *                   message: "點數資料不存在"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
