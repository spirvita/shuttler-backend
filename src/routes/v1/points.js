const express = require('express');
const router = express.Router();
const pointsController = require('../../controllers/points');
const { authenticateJWT } = require('../../middlewares/auth');

router.post('/purchase', authenticateJWT, pointsController.purchasePoints);
router.post('/newebpay-notify', pointsController.newebpayNotify);
router.post('/newebpay-return', pointsController.newebpayReturn);
router.get('/callbackCheck', authenticateJWT, pointsController.callbackCheck);
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

/**
 * @swagger
 * /api/v1/points/purchase:
 *   post:
 *     tags: [Points]
 *     summary: 購買點數
 *     description: 建立點數訂單並回傳加密資訊以導向金流頁面
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pointsPlan
 *             properties:
 *               pointsPlan:
 *                 type: object
 *                 properties:
 *                   points:
 *                     type: integer
 *                     example: 100
 *                   value:
 *                     type: integer
 *                     example: 100
 *     responses:
 *       200:
 *         description: 成功建立訂單
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     MerchantID:
 *                       type: string
 *                     varsion:
 *                       type: string
 *                     TradeInfo:
 *                       type: string
 *                     TradeSha:
 *                       type: string
 *       404:
 *         description: 找不到資源
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               userNotFound:
 *                 summary: 使用者不存在
 *                 value:
 *                   message: "使用者不存在"
 *               planNotFound:
 *                 summary: 點數方案不存在
 *                 value:
 *                   message: "點數方案不存在"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/points/callbackCheck:
 *   get:
 *     tags: [Points]
 *     summary: 檢查點數訂單狀態
 *     description: 查詢最近五分鐘內完成的點數訂單狀態
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 查詢成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     orderStatus:
 *                       type: string
 *                       example: completed
 *                     pointsValue:
 *                       type: integer
 *                       example: 100
 *                     userPoints:
 *                       type: integer
 *                       example: 300
 *                     merchantOrderNo:
 *                       type: string
 *                       example: "1749362720"
 *             examples:
 *               success:
 *                 summary: 查詢成功
 *                 value:
 *                   message: "查詢成功"
 *                   data:
 *                     orderStatus: "completed"
 *                     pointsValue: 100
 *                     userPoints: 300
 *                     merchantOrderNo: "1749362720"
 *               noRecentOrder:
 *                 summary: 查無5分鐘內訂單
 *                 value:
 *                   message: "查無5分鐘內訂單"
 *       404:
 *         description: 查無最近訂單
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 沒有找到最近的點數訂單
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
