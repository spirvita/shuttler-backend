const express = require('express');
const router = express.Router();
const activityController = require('../../controllers/activity');
const { authenticateJWT, optionalAuthenticateJWT } = require('../../middlewares/auth');

router.post('/', authenticateJWT, activityController.createActivity);
router.get('/upcoming', optionalAuthenticateJWT, activityController.upcomingActivities);
router.get('/popular', optionalAuthenticateJWT, activityController.popularActivities);
router.post('/favorites', authenticateJWT, activityController.addFavoriteActivities);
router.post('/registration', authenticateJWT, activityController.registerActivity);
router.delete('/registration/:activityId', authenticateJWT, activityController.cancelActivity);
router.delete(
  '/favorites/:activityId',
  authenticateJWT,
  activityController.deleteFavoriteActivities,
);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Activity
 *   description: 活動頁面
 */

/**
 * @swagger
 * /api/v1/activity:
 *   post:
 *     tags: [Activity]
 *     summary: 新增/儲存活動
 *     description: 主辦人可以新增活動和儲存活動
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - participantCount
 *               - rentalLot
 *               - ballType
 *               - level
 *               - venueName
 *               - venueFacilities
 *               - contactName
 *               - contactPhone
 *             properties:
 *               name:
 *                 type: string
 *                 description: 活動名稱
 *                 example: "羽球友善場地"
 *               pictures:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 圖片 URL 陣列
 *                 example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *               date:
 *                 type: string
 *                 format: date
 *                 description: 活動日期
 *                 example: "2024-03-20"
 *               startTime:
 *                 type: string
 *                 description: 活動開始時間
 *                 example: "14:00"
 *               endTime:
 *                 type: string
 *                 description: 活動結束時間
 *                 example: "16:00"
 *               participantCount:
 *                 type: integer
 *                 minimum: 1
 *                 description: 活動名額
 *                 example: 20
 *               rentalLot:
 *                 type: integer
 *                 minimum: 1
 *                 description: 租借場地數量
 *                 example: 2
 *               ballType:
 *                 type: string
 *                 description: 球種
 *                 example: "羽球"
 *               points:
 *                 type: integer
 *                 minimum: 0
 *                 description: 活動點數
 *                 example: 100
 *               level:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: 羽球程度
 *                 example: [1, 2]
 *               brief:
 *                 type: string
 *                 description: 活動簡介
 *                 example: "適合新手的友善場地"
 *               city:
 *                 type: string
 *                 description: 縣市
 *                 example: "台北市"
 *               district:
 *                 type: string
 *                 description: 區域
 *                 example: "中山區"
 *               address:
 *                 type: string
 *                 description: 活動地址
 *                 example: "中山北路二段"
 *               venueName:
 *                 type: string
 *                 description: 場地名稱
 *                 example: "市民運動中心"
 *               venueFacilities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 場館設施
 *                 example: ["更衣室", "淋浴間"]
 *               contactName:
 *                 type: string
 *                 description: 聯絡人姓名
 *                 example: "王大明"
 *               contactPhone:
 *                 type: string
 *                 description: 聯絡人電話
 *                 example: "0912345678"
 *               contactLine:
 *                 type: string
 *                 description: 聯絡人 Line ID
 *                 example: "line123"
 *               status:
 *                 type: string
 *                 enum: ["draft", "published"]
 *                 description: 活動狀態
 *     responses:
 *       201:
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
 *               publishData:
 *                 summary: 發佈成功
 *                 value:
 *                   message: "發佈成功"
 *                   activityId: "1c8da31a-5fd2-44f3-897e-4a259e7ec62b"
 *               draftData:
 *                 summary: 儲存成功
 *                 value:
 *                   message: "儲存成功"
 *                   activityId: "1c8da31a-5fd2-44f3-897e-4a259e7ec62b"
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
 *               invalidUUID:
 *                 summary: ID未填寫正確
 *                 value:
 *                   message: "ID未填寫正確"
 *               invalidName:
 *                 summary: 活動名稱未填寫正確
 *                 value:
 *                   message: "活動名稱未填寫正確"
 *               invalidPictures:
 *                 summary: 圖片未填寫正確
 *                 value:
 *                   message: "圖片未填寫正確"
 *               invalidPictureCount:
 *                 summary: 圖片數量不能超過5張
 *                 value:
 *                   message: "圖片數量不能超過5張"
 *               invalidDate:
 *                 summary: 活動日期未填寫正確
 *                 value:
 *                   message: "活動日期未填寫正確"
 *               invalidStartTime:
 *                 summary: 活動開始時間未填寫正確
 *                 value:
 *                   message: "活動開始時間未填寫正確"
 *               invalidEndTime:
 *                 summary: 活動結束時間未填寫正確
 *                 value:
 *                   message: "活動結束時間未填寫正確"
 *               invalidParticipantCount:
 *                 summary: 人數未填寫正確
 *                 value:
 *                   message: "人數未填寫正確"
 *               invalidRentalLot:
 *                 summary: 租用場地數量未填寫正確
 *                 value:
 *                   message: "租用場地數量未填寫正確"
 *               invalidBallType:
 *                 summary: 球類未填寫正確
 *                 value:
 *                   message: "球類未填寫正確"
 *               invalidPoints:
 *                 summary: 點數未填寫正確
 *                 value:
 *                   message: "點數未填寫正確"
 *               invalidLevel:
 *                 summary: 程度未填寫正確
 *                 value:
 *                   message: "程度未填寫正確"
 *               invalidBrief:
 *                 summary: 簡介未填寫正確
 *                 value:
 *                   message: "簡介未填寫正確"
 *               invalidCity:
 *                 summary: 縣市未填寫正確
 *                 value:
 *                   message: "縣市未填寫正確"
 *               invalidDistrict:
 *                 summary: 區域未填寫正確
 *                 value:
 *                   message: "區域未填寫正確"
 *               invalidVenueName:
 *                 summary: 場地名稱未填寫正確
 *                 value:
 *                   message: "場地名稱未填寫正確"
 *               invalidAddress:
 *                 summary: 地址未填寫正確
 *                 value:
 *                   message: "地址未填寫正確"
 *               invalidVenueFacilities:
 *                 summary: 場地設施未填寫正確
 *                 value:
 *                   message: "場地設施未填寫正確"
 *               invalidContactName:
 *                 summary: 聯絡人姓名未填寫正確
 *                 value:
 *                   message: "聯絡人姓名未填寫正確"
 *               invalidContactPhone:
 *                 summary: 聯絡人電話未填寫正確
 *                 value:
 *                   message: "聯絡人電話未填寫正確"
 *               invalidContactLine:
 *                 summary: 聯絡人Line未填寫正確
 *                 value:
 *                   message: "聯絡人Line未填寫正確"
 *               invalidStatus:
 *                 summary: 狀態未填寫正確
 *                 value:
 *                   message: "狀態未填寫正確"
 *               invalidStartTimeInPast:
 *                 summary: 發佈活動時，開始時間必須在現在時間之後
 *                 value:
 *                   message: "發佈活動時，開始時間必須在現在時間之後"
 *               invalidEndTimeBeforeStartTime:
 *                 summary: 發佈活動時，結束時間必須在開始時間之後
 *                 value:
 *                   message: "發佈活動時，結束時間必須在開始時間之後"
 *               invalidStartTimeInFuture:
 *                 summary: 儲存活動時，開始時間必須在現在時間之後
 *                 value:
 *                   message: "儲存活動時，開始時間必須在現在時間之後"
 *               invalidEndTimeBeforeStartTimeInFuture:
 *                 summary: 儲存活動時，結束時間必須在開始時間之後
 *                 value:
 *                   message: "儲存活動時，結束時間必須在開始時間之後"
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
 *               cityNotFound:
 *                 summary: 找不到該縣市區
 *                 value:
 *                   message: "找不到該縣市區"
 *               levelNotFound:
 *                 summary: 無此等級
 *                 value:
 *                   message: "無此等級"
 *               facilityNotFound:
 *                 summary: 無此設施
 *                 value:
 *                   message: "無此設施"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/activity/upcoming:
 *   get:
 *     tags: [Activity]
 *     summary: 取得近期活動
 *     description: 使用者可以取得近期活動
 *     security: []
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
 *                       picture: "https://example.com/img.jpg"
 *                       date: "2024-03-20"
 *                       startTime: "14:00"
 *                       endTime: "16:00"
 *                       city: "台北市"
 *                       level: ["新手", "初級"]
 *                       participantCount: 12
 *                       bookedCount: 8
 *                       points: 100
 *               noData:
 *                 summary: 目前無資料
 *                 value:
 *                   message: "目前無資料"
 *                   data: []
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/activity/popular:
 *   get:
 *     tags: [Activity]
 *     summary: 取得熱門活動
 *     description: 使用者可以取得熱門活動
 *     security: []
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
 *                       picture: "https://example.com/img.jpg"
 *                       city: "台北市"
 *                       level: ["新手", "初級"]
 *                       participantCount: 12
 *                       bookedCount: 8
 *                       points: 100
 *               noData:
 *                 summary: 目前無資料
 *                 value:
 *                   message: "目前無資料"
 *                   data: []
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/activity/favorites:
 *   post:
 *     tags: [Activity]
 *     summary: 收藏活動
 *     description: 使用者可以收藏活動
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - activityId
 *             properties:
 *               activityId:
 *                 type: uuid
 *                 description: 活動 ID
 *     responses:
 *       201:
 *         description: 收藏成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "收藏成功"
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
 *               invalidUUID:
 *                 summary: ID未填寫正確
 *                 value:
 *                   message: "ID未填寫正確"
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
 *               memberNotFound:
 *                 summary: 會員不存在
 *                 value:
 *                   message: "會員不存在"
 *               activityNotFound:
 *                 summary: 活動不存在
 *                 value:
 *                   message: "活動不存在"
 *       409:
 *         description: 已收藏過此活動
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               alreadyFavorited:
 *                 summary: 已收藏過此活動
 *                 value:
 *                   message: "已收藏過此活動"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/activity/registration:
 *   post:
 *     tags: [Activity]
 *     summary: 報名活動
 *     description: 使用者可以報名活動
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - activityId
 *               - participantCount
 *             properties:
 *               activityId:
 *                 type: uuid
 *                 description: 活動 ID
 *               participantCount:
 *                 type: integer
 *                 minimum: 1
 *                 description: 報名人數
 *     responses:
 *       201:
 *         description: 報名成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "報名成功"
 *                 registrationId:
 *                   type: uuid
 *                   example: "1c8da31a-5fd2-44f3-897e-4a259e7ec62b"
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
 *               invalidUUID:
 *                 summary: 活動ID未填寫正確
 *                 value:
 *                   message: "活動ID未填寫正確"
 *               invalidParticipantCount:
 *                 summary: 報名人數未填寫正確
 *                 value:
 *                   message: "報名人數未填寫正確"
 *               activityIsEnded:
 *                 summary: 活動已結束
 *                 value:
 *                   message: "活動已結束"
 *               registrationCountNotEnough:
 *                 summary: 活動名額不足，剩餘 (0)
 *                 value:
 *                   message: "活動名額不足，剩餘 (0)"
 *               registrationPointsNotEnough:
 *                 summary: 報名失敗，活動點數不足
 *                 value:
 *                   message: "報名失敗，活動點數不足"
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
 *               memberNotFound:
 *                 summary: 會員不存在
 *                 value:
 *                   message: "會員不存在"
 *               activityNotFound:
 *                 summary: 活動不存在
 *                 value:
 *                   message: "活動不存在"
 *       409:
 *         description: 你已經報名此活動
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               alreadyFavorited:
 *                 summary: 你已經報名此活動
 *                 value:
 *                   message: "你已經報名此活動"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/activity/registration/{activityId}:
 *   delete:
 *     tags: [Activity]
 *     summary: 取消報名活動
 *     description: 使用者可以取消報名活動
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: uuid
 *         description: 活動 ID
 *     responses:
 *       200:
 *         description: 取消報名成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "取消報名成功"
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
 *               invalidUUID:
 *                 summary: 活動ID未填寫正確
 *                 value:
 *                   message: "活動ID未填寫正確"
 *               activityIsEnded:
 *                 summary: 活動已結束，無法取消報名
 *                 value:
 *                   message: "活動已結束，無法取消報名"
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
 *               memberNotFound:
 *                 summary: 會員不存在
 *                 value:
 *                   message: "會員不存在"
 *               activityNotFound:
 *                 summary: 活動不存在
 *                 value:
 *                   message: "活動不存在"
 *               registrationNotFound:
 *                 summary: 你尚未報名此活動
 *                 value:
 *                   message: "你尚未報名此活動"
 *       409:
 *         description: 你已經取消報名此活動
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               notRegistered:
 *                 summary: 你已經取消報名此活動
 *                 value:
 *                   message: "你已經取消報名此活動"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/activity/favorites/{activityId}:
 *   delete:
 *     tags: [Activity]
 *     summary: 取消收藏活動
 *     description: 使用者可以取消收藏活動
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: uuid
 *         description: 活動 ID
 *     responses:
 *       200:
 *         description: 取消收藏成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "取消收藏成功"
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
 *               invalidUUID:
 *                 summary: 活動ID未填寫正確
 *                 value:
 *                   message: "活動ID未填寫正確"
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
 *               memberNotFound:
 *                 summary: 會員不存在
 *                 value:
 *                   message: "會員不存在"
 *               activityNotFound:
 *                 summary: 活動不存在
 *                 value:
 *                   message: "活動不存在"
 *       409:
 *         description: 尚未收藏過此活動
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               notFavorited:
 *                 summary: 尚未收藏過此活動
 *                 value:
 *                   message: "尚未收藏過此活動"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
