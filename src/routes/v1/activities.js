const express = require('express');
const router = express.Router();
const activitiesController = require('../../controllers/activities');
const { optionalAuthenticateJWT } = require('../../middlewares/auth');

router.get('/', activitiesController.getActivities);
router.get('/:activityId', optionalAuthenticateJWT, activitiesController.getActivity);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Activities
 *   description: 活動頁面
 */

/**
 * @swagger
 * /api/v1/activities:
 *   get:
 *     security: []
 *     tags: [Activities]
 *     summary: 取得活動列表
 *     description: 取得所有已發布的活動，支援多種篩選條件
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜尋關鍵字（活動名稱或場地名稱）
 *       - in: query
 *         name: zipCode
 *         schema:
 *           type: string
 *         description: 郵遞區號
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: 縣市名稱（與 zipCode 擇一使用）
 *       - in: query
 *         name: spotsLeft
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *         description: 剩餘名額數量 (1-10)
 *       - in: query
 *         name: level
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 7
 *         description: 活動等級 (1-7)
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: 活動日期（YYYY-MM-DD）
 *       - in: query
 *         name: timeSlot
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 23
 *         description: 活動時段（0-23 小時）
 *       - in: query
 *         name: points
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 1000
 *         description: 最低點數要求 (0-1000)
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
 *                       date: "2024-03-20"
 *                       name: "週末羽球團"
 *                       contactAvatar: "https://example.com/avatar.jpg"
 *                       venueName: "市民運動中心"
 *                       startTime: "14:00"
 *                       endTime: "16:00"
 *                       level: ["新手", "初級"]
 *                       participantCount: 12
 *                       bookedCount: 8
 *                       points: 100
 *               noData:
 *                 summary: 目前無資料
 *                 value:
 *                   message: "目前無資料"
 *                   data: []
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
 *               invalidSearch:
 *                 summary: 搜尋關鍵字錯誤
 *                 value:
 *                   message: "搜尋關鍵字未填寫正確"
 *               invalidLocation:
 *                 summary: 縣市區與縣市僅能擇一使用
 *                 value:
 *                   message: "縣市區與縣市僅能擇一使用"
 *               invalidZipCode:
 *                 summary: 縣市區未填寫正確
 *                 value:
 *                   message: "縣市區未填寫正確"
 *               invalidCity:
 *                 summary: 縣市未填寫正確
 *                 value:
 *                   message: "縣市未填寫正確"
 *               invalidSpotsLeft:
 *                 summary: 報名人數未填寫正確
 *                 value:
 *                   message: "報名人數未填寫正確"
 *               invalidLevel:
 *                 summary: 等級未填寫正確
 *                 value:
 *                   message: "等級未填寫正確"
 *               invalidPoints:
 *                 summary: 點數未填寫正確
 *                 value:
 *                   message: "點數未填寫正確"
 *               invalidDateTimeSlot:
 *                 summary: 請提供日期以搭配時段
 *                 value:
 *                   message: "請提供日期以搭配時段"
 *               invalidDate:
 *                 summary: 日期格式錯誤，請使用 YYYY-MM-DD
 *                 value:
 *                   message: "日期格式錯誤，請使用 YYYY-MM-DD"
 *               invalidTimeSlot:
 *                 summary: 時段格式錯誤，請提供 0~23 的數字
 *                 value:
 *                   message: "時段格式錯誤，請提供 0~23 的數字"
 *               invalidDatetime:
 *                 summary: 無效的日期時間
 *                 value:
 *                   message: "無效的日期時間"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/activities/{activityId}:
 *   get:
 *     security: []
 *     tags: [Activities]
 *     summary: 取得單一活動詳細資訊
 *     description: 取得特定活動的詳細資訊
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 活動 ID
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
 *                   example: 成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     activityId:
 *                       type: string
 *                       format: uuid
 *                       example: "1c8da31a-5fd2-44f3-897e-4a259e7ec62b"
 *                     name:
 *                       type: string
 *                       example: "週末羽球團"
 *                     organizer:
 *                       type: string
 *                       example: "羽球同好會"
 *                     pictures:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["https://example.com/image1.jpg"]
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2024-03-20"
 *                     startTime:
 *                       type: string
 *                       example: "14:00"
 *                     endTime:
 *                       type: string
 *                       example: "16:00"
 *                     venueName:
 *                       type: string
 *                       example: "市民運動中心"
 *                     city:
 *                       type: string
 *                       example: "台北市"
 *                     district:
 *                       type: string
 *                       example: "中山區"
 *                     address:
 *                       type: string
 *                       example: "中山北路二段"
 *                     venueFacilities:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["淋浴間", "置物櫃"]
 *                     ballType:
 *                       type: string
 *                       example: "羽球"
 *                     level:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["新手", "中階"]
 *                     participantCount:
 *                       type: integer
 *                       example: 12
 *                     bookedCount:
 *                       type: integer
 *                       example: 8
 *                     rentalLot:
 *                       type: integer
 *                       example: 3
 *                     brief:
 *                       type: string
 *                       example: "適合新手的友善場地"
 *                     contactAvatar:
 *                       type: string
 *                       example: "https://example.com/avatar.jpg"
 *                     contactName:
 *                       type: string
 *                       example: "王大明"
 *                     contactPhone:
 *                       type: string
 *                       example: "0912345678"
 *                     contactLine:
 *                       type: string
 *                       example: "line_id"
 *                     points:
 *                       type: integer
 *                       example: 100
 *                     isFavorite:
 *                       type: boolean
 *                       example: false
 *                     status:
 *                       type: string
 *                       enum: ["published", "full", "ended", "registered"]
 *                       example: "published"
 *       400:
 *         description: 請求參數錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID未填寫正確"
 *       404:
 *         description: 找不到活動
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "查無活動資料"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
