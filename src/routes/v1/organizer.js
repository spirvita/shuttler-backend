const express = require('express');
const router = express.Router();
const organizerController = require('../../controllers/organizer');
const { authenticateJWT } = require('../../middlewares/auth');

router.get('/activities', authenticateJWT, organizerController.getActivities);
router.get('/activities/:activityId', authenticateJWT, organizerController.getActivity);
router.put('/activity/:activityId', authenticateJWT, organizerController.updateActivity);
router.post('/activity/:activityId/suspend', authenticateJWT, organizerController.suspendActivity);
router.put('/draft/:activityId', authenticateJWT, organizerController.updateDraftActivity);
router.delete('/draft/:activityId', authenticateJWT, organizerController.deleteDraftActivity);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Organizer
 *   description: 活動管理
 */

/**
 * @swagger
 * /api/v1/organizer/activities:
 *   get:
 *     tags: [Organizer]
 *     summary: 取得主辦人活動
 *     description: 取得主辦人建立的不同狀態活動
 *     security:
 *       - bearerAuth: []
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
 *                       contactName: "王大明"
 *                       contactPhone: "0912345678"
 *                       contactLine: "line123"
 *                       points: 100
 *                       status: "published"
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
 * /api/v1/organizer/activities/{activityId}:
 *   get:
 *     tags: [Organizer]
 *     summary: 取得主辦人活動報名名單
 *     description: 主辦人取得活動的報名名單
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: string
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
 *                 data:
 *                   type: array
 *             examples:
 *               hasData:
 *                 summary: 成功
 *                 value:
 *                   message: "成功"
 *                   data:
 *                     - memberId: "1c8da31a-5fd2-44f3-897e-4a259e7ec62b"
 *                       name: "李曉明"
 *                       email: "example1@example.com"
 *                       registrationDate: "2025-06-03 14:31"
 *                       cancellationDate: "2025-06-03 14:31"
 *                       registrationCount: 2
 *                       registrationPoints: 400
 *                       refundPoints: 400
 *                       status: "已報名"
 *               noData:
 *                 summary: 目前無資料
 *                 value:
 *                   message: "目前無資料"
 *                   data: []
 *       400:
 *         description: 無此活動
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "無此活動"
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
 * /api/v1/organizer/activity/{activityId}:
 *   put:
 *     tags: [Organizer]
 *     summary: 編輯活動
 *     description: 主辦人可以對已發佈活動做有限度的編輯
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: string
 *         description: 活動 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - participantCount
 *               - rentalLot
 *               - ballType
 *               - level
 *               - venueName
 *               - venueFacilities
 *               - contactName
 *               - contactPhone
 *             properties:
 *               pictures:
 *                 type: array
 *                 items:
 *                   type: string
 *                 format: uri
 *                 description: 圖片 URL 陣列
 *                 example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *               participantCount:
 *                 type: integer
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
 *               level:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 活動等級
 *                 example: ["新手", "初級"]
 *               brief:
 *                 type: string
 *                 description: 活動簡介
 *                 example: "適合新手的友善場地"
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
 *     responses:
 *       200:
 *         description: 編輯成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "編輯成功"
 *                 activityId:
 *                   type: string
 *                   format: uuid
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
 *                 summary: ID未填寫正確
 *                 value:
 *                   message: "ID未填寫正確"
 *               invalidPictures:
 *                 summary: 圖片未填寫正確
 *                 value:
 *                   message: "圖片未填寫正確"
 *               invalidPictureCount:
 *                 summary: 圖片數量不能超過5張
 *                 value:
 *                   message: "圖片數量不能超過5張"
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
 *               invalidLevel:
 *                 summary: 程度未填寫正確
 *                 value:
 *                   message: "程度未填寫正確"
 *               invalidBrief:
 *                 summary: 簡介未填寫正確
 *                 value:
 *                   message: "簡介未填寫正確"
 *               invalidVenueName:
 *                 summary: 場地名稱未填寫正確
 *                 value:
 *                   message: "場地名稱未填寫正確"
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
 *               activityCountLessThanBooked:
 *                 summary: 活動名額不能小於已報名人數 (10)
 *                 value:
 *                   message: "活動名額不能小於已報名人數 (10)"
 *               updateFailed:
 *                 summary: 更新失敗
 *                 value:
 *                   message: "更新失敗"
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
 *               activityNotFound:
 *                 summary: 活動不存在或無權限編輯
 *                 value:
 *                   message: "活動不存在或無權限編輯"
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
 * /api/v1/organizer/activity/{activityId}/suspend:
 *   post:
 *     tags: [Organizer]
 *     summary: 停辦活動
 *     description: 主辦人可以將指定活動停辦
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: string
 *         description: 活動 ID
 *     responses:
 *       200:
 *         description: 停辦成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "停辦成功"
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
 *               activityNotFound:
 *                 summary: 活動已經是停辦狀態
 *                 value:
 *                   message: "活動已經是停辦狀態"
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
 *               activityNotFound:
 *                 summary: 無此活動或無權限查看
 *                 value:
 *                   message: "無此活動或無權限查看"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/v1/organizer/draft/{activityId}:
 *   put:
 *     tags: [Organizer]
 *     summary: 更新草稿活動
 *     description: 主辦人可以更新草稿活動的資訊
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: string
 *         description: 活動 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - date
 *               - startTime
 *               - endTime
 *               - participantCount
 *               - rentalLot
 *               - ballType
 *               - points
 *               - level
 *               - city
 *               - district
 *               - address
 *               - venueName
 *               - venueFacilities
 *               - contactName
 *               - contactPhone
 *               - status
 *             properties:
 *               name:
 *                 type: string
 *                 description: 活動名稱
 *                 example: "週末羽球團"
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
 *                 example: "中正區"
 *               address:
 *                 type: string
 *                 description: 活動地址
 *                 example: "中正路123號"
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
 * /api/v1/organizer/draft/{activityId}:
 *   delete:
 *     tags: [Organizer]
 *     summary: 刪除草稿活動
 *     description: 主辦人可以刪除草稿活動
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: string
 *         description: 活動 ID
 *     responses:
 *       200:
 *         description: 刪除成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "刪除成功"
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
 *               activityNotFound:
 *                 summary: 無此活動或無權限刪除
 *                 value:
 *                   message: "無此活動或無權限刪除"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
