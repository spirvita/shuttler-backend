const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user');
const { authenticateJWT } = require('../../middlewares/auth');

router.get('/activities', authenticateJWT, userController.getMemberActivities);
router.get('/profile', authenticateJWT, userController.getMemberProfile);
router.put('/profile', authenticateJWT, userController.updateMemberProfile);
router.get('/favorites', authenticateJWT, userController.getMemberFavorites);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: User
 *   description: 會員中心
 */

/**
 * @swagger
 * /api/v1/user/activities:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [User]
 *     summary: 取得會員參與活動列表
 *     description: 取得會員參加的所有活動
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
 *                 data:
 *                   type: array
 *             examples:
 *               hasData:
 *                 summary: 成功
 *                 value:
 *                   message: "成功"
 *                   data:
 *                     - activityId: "1c8da31a-5fd2-44f3-897e-4a259e7ec62b"
 *                       name: "週末羽球團"
 *                       date: "2024-03-20"
 *                       startTime: "14:00"
 *                       endTime: "16:00"
 *                       venueName: "市民運動中心"
 *                       city: "台北市"
 *                       district: "中正區"
 *                       address: "中正路123號"
 *                       level: ["新手", "初級"]
 *                       participantCount: 12
 *                       bookedCount: 8
 *                       contactAvatar: "https://example.com/avatar.jpg"
 *                       contactName: "李四"
 *                       contactPhone: "0912345678"
 *                       contactLine: "line_id_123"
 *                       points: 100
 *                       status: "registered"
 *               noData:
 *                 summary: 目前無資料
 *                 value:
 *                   message: "目前無資料"
 *                   data: []
 *       401:
 *         description: 身份驗證失敗
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "身份驗證失敗"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/user/profile:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [User]
 *     summary: 取得會員個人資料
 *     description: 取得會員的個人資料
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
 *                 data:
 *                   type: array
 *             examples:
 *               hasData:
 *                 summary: 成功
 *                 value:
 *                   message: "成功"
 *                   data:
 *                     - name: "週末羽球團"
 *                       email: "example1@example.com"
 *                       avatar: "https://example.com/avatar.jpg"
 *                       preferredLocation: ["105", "110", "111"]
 *                       registerDate: "2024-03-20"
 *                       level: 1
 *                       totalPoints: 1200
 *                       attendCount: 12
 *       401:
 *         description: 身份驗證失敗
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "身份驗證失敗"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/user/profile:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags: [User]
 *     summary: 更新會員個人資料
 *     description: 更新會員的個人資料
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: 姓名
 *               avatar:
 *                 type: string
 *                 format: uri
 *                 description: 會員頭像
 *               level:
 *                 type: integer
 *                 description: 羽球程度
 *               preferredLocation:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 會員偏好的地區列表
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
 *                 data:
 *                   type: array
 *             examples:
 *               hasData:
 *                 summary: 成功
 *                 value:
 *                   message: "成功"
 *                   data:
 *                     - name: "王小明"
 *                       avatar: "https://example.com/avatar.jpg"
 *                       email: "example1@example.com"
 *                       preferredLocation: ["105", "110", "111"]
 *                       level: 1
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
 *               invalidField:
 *                 summary: 欄位未填寫正確
 *                 value:
 *                   message: "欄位未填寫正確"
 *               invalidEmail:
 *                 summary: Email 格式不正確
 *                 value:
 *                   message: "Email 格式不正確"
 *               invalidMember:
 *                 summary: 更新使用者資料失敗
 *                 value:
 *                   message: "更新使用者資料失敗"
 *               invalidLevel:
 *                 summary: 等級不存在
 *                 value:
 *                   message: "等級不存在"
 *       401:
 *         description: 身份驗證失敗
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "身份驗證失敗"
 *       409:
 *         description: 此 Email 已經註冊
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "此 Email 已經註冊"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/user/favorites:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [User]
 *     summary: 取得會員收藏的活動
 *     description: 取得會員收藏的所有活動
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
 *                 data:
 *                   type: array
 *             examples:
 *               hasData:
 *                 summary: 成功
 *                 value:
 *                   message: "成功"
 *                   data:
 *                     - activityId: "1c8da31a-5fd2-44f3-897e-4a259e7ec62b"
 *                       name: "週末羽球團"
 *                       date: "2024-03-20"
 *                       startTime: "14:00"
 *                       endTime: "16:00"
 *                       venueName: "市民運動中心"
 *                       city: "台北市"
 *                       district: "中正區"
 *                       address: "中正路123號"
 *                       level: ["新手", "初級"]
 *                       participantCount: 12
 *                       bookedCount: 8
 *                       contactAvatar: "https://example.com/avatar.jpg"
 *                       contactName: "李四"
 *                       contactPhone: "0912345678"
 *                       contactLine: "line_id_123"
 *                       points: 100
 *               noData:
 *                 summary: 目前無資料
 *                 value:
 *                   message: "目前無資料"
 *                   data: []
 *       401:
 *         description: 身份驗證失敗
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "身份驗證失敗"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
