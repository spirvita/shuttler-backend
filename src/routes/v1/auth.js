const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth');
const passport = require('passport');
const { authenticateLocal, authenticateJWT } = require('../../middlewares/auth');

router.post('/signup', authController.signUp);
router.post('/login', authenticateLocal, authController.login);
router.post('/logout', authController.logout);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/',
  }),
  authController.googleAuthCallback,
);
router.post('/reset-password', authenticateJWT, authController.resetPassword);

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

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: 修改密碼
 *     description: 使用者可以修改自己的密碼
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *               - checkNewPassword
 *             properties:
 *               password:
 *                 type: string
 *                 description: 舊密碼
 *                 example: "Aa12345678"
 *               newPassword:
 *                 type: string
 *                 description: 新密碼
 *                 example: "Bb12345678"
 *               checkNewPassword:
 *                 type: string
 *                 description: 確認新密碼
 *                 example: "Bb12345678"
 *     responses:
 *       200:
 *         description: 修改密碼成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 修改密碼成功
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
 *               passwordError:
 *                 summary: 密碼格式錯誤
 *                 value:
 *                   message: "密碼不符合規則，密碼長度必須至少 10 個字元，且至少包含 1 個數字和 1 個英文字母"
 *               passwordMismatch:
 *                 summary: 新密碼與確認新密碼不一致
 *                 value:
 *                   message: "新密碼與確認新密碼不一致"
 *               userNotFound:
 *                 summary: 此 Email 未註冊
 *                 value:
 *                   message: "此 Email 未註冊"
 *               oldPasswordError:
 *                 summary: 舊密碼輸入錯誤
 *                 value:
 *                   message: "舊密碼輸入錯誤"
 *               samePasswordError:
 *                 summary: 新密碼不能與舊密碼相同
 *                 value:
 *                   message: "新密碼不能與舊密碼相同"
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
