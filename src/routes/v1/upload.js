const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/upload');
const uploadErrorHandler = require('../../middlewares/uploadErrorHandler');
const { authenticateJWT } = require('../../middlewares/auth');
const uploadController = require('../../controllers/upload');

router.post('/', authenticateJWT, upload.any(), uploadErrorHandler, uploadController.uploadImage);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Upload Image
 *   description: 上傳圖片
 */

/**
 * @swagger
 * /api/v1/upload-image:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Upload Image]
 *     summary: 上傳圖片
 *     description: 上傳圖片到伺服器，並返回圖片 URL
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: 要上傳的圖片檔案
 *               uploadType:
 *                 type: string
 *                 enum: [avatar, activity]
 *                 description: 上傳類型，決定圖片存儲位置
 *     responses:
 *       200:
 *         description: 上傳圖片成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "上傳成功"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: uri
 *                   example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
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
 *               invalidFilesType:
 *                 summary: 缺少上傳類型
 *                 value:
 *                   message: "缺少上傳類型"
 *               invalidFiles:
 *                 summary: 沒有檔案上傳
 *                 value:
 *                   message: "沒有檔案上傳"
 *               invalidUploadType:
 *                 summary: 不支援的上傳策略
 *                 value:
 *                   message: "不支援的上傳策略"
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
