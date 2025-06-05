const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth');
const passport = require('passport');
const { authenticateLocal } = require('../../middlewares/auth');

router.post('/signup', authController.signUp);
router.post('/login', authenticateLocal, authController.login);
router.post('/logout', authController.logout);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/healthcheck',
  }),
  authController.googleAuthCallback,
);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 登入/註冊
 */

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     security: []
 *     tags: [Auth]
 *     summary: email 帳號註冊
 *     description: 使用 email 註冊帳號
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 帳號
 *                 example: "example1@example.com"
 *               name:
 *                 type: string
 *                 description: 顯示名稱
 *                 example: "王大明"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: 密碼
 *                 example: "Aa12345678"
 *     responses:
 *       201:
 *         description: 註冊成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 註冊成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                          format: uuid
 *                          description: 使用者 ID
 *                          example: "1c8da31a-5fd2-44f3-897e-4a259e7ec62b"
 *                        name:
 *                          type: string
 *                          description: 使用者名稱
 *                          example: "王大明"
 *                     token:
 *                       type: string
 *                       description: JWT token
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: 請求資料格式錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               passwordError:
 *                 summary: 密碼格式錯誤
 *                 value:
 *                   message: "密碼不符合規則，需要包含英文數字大小寫，無特殊字元，最短8個字，最長32個字"
 *               emailError:
 *                 summary: Email 格式錯誤
 *                 value:
 *                   message: "Email 格式不正確"
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
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: email 登入
 *     description: 使用 email 跟密碼登入
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 帳號
 *                 example: "example1@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: 密碼
 *                 example: "Aa12345678"
 *     responses:
 *       200:
 *         description: 登入成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 登入成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                          format: uuid
 *                          description: 使用者 ID
 *                          example: "1c8da31a-5fd2-44f3-897e-4a259e7ec62b"
 *                        name:
 *                          type: string
 *                          description: 使用者名稱
 *                          example: "王大明"
 *                        email:
 *                          type: string
 *                          format: email
 *                          description: 使用者 Email
 *                          example: "example1@example.com"
 *                     token:
 *                       type: string
 *                       description: JWT token
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: 請求資料格式錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               passwordError:
 *                 summary: 帳號或密碼輸入錯誤
 *                 value:
 *                   message: "帳號或密碼輸入錯誤"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: 使用者登出
 *     description: 使用者登出此平台
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 登出成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "登出成功"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/auth/google:
 *   get:
 *     security: []
 *     tags: [Auth]
 *     summary: 使用 google 註冊
 *     description: 使用 google 註冊
 *     responses:
 *       201:
 *         description: 註冊成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 註冊成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                          format: uuid
 *                          description: 使用者 ID
 *                          example: "1c8da31a-5fd2-44f3-897e-4a259e7ec62b"
 *                        name:
 *                          type: string
 *                          description: 使用者名稱
 *                          example: "王大明"
 *                     token:
 *                       type: string
 *                       description: JWT token
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
