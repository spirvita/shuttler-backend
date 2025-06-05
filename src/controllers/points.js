const { dataSource } = require('../db/data-source');
const logger = require('../utils/logger')('Points');
const appError = require('../utils/appError');
const config = require('../config');
const crypto = require('crypto');
const { parseNewebpayTime } = require('../utils/parseNewebpayTime');

const HASHKEY = config.get('newebpay.HashKey');
const HASHIV = config.get('newebpay.HashIV');
const MerchantID = config.get('newebpay.MerchantID');
const Version = config.get('newebpay.Version') || '2.2';

function genDataChain(order) {
  return `MerchantID=${MerchantID}&RespondType=JSON&TimeStamp=${order.TimeStamp}&Version=${Version}&MerchantOrderNo=${order.TimeStamp}&Amt=${order.Amt}&ItemDesc=${encodeURIComponent(order.ItemDesc)}&Email=${encodeURIComponent(order.email)}&CREDIT=1`;
}

function createMpgAesEncrypt(TradeInfo) {
  const encrypt = crypto.createCipheriv('aes256', HASHKEY, HASHIV);
  const enc = encrypt.update(genDataChain(TradeInfo), 'utf8', 'hex');
  return enc + encrypt.final('hex');
}

function createMpgShaEncrypt(aesEncrypt) {
  const sha = crypto.createHash('sha256');
  const plainText = `HashKey=${HASHKEY}&${aesEncrypt}&HashIV=${HASHIV}`;

  return sha.update(plainText).digest('hex').toUpperCase();
}

function createMpgAesDecrypt(TradeInfo) {
  const decrypt = crypto.createDecipheriv('aes256', HASHKEY, HASHIV);
  decrypt.setAutoPadding(false);
  const text = decrypt.update(TradeInfo, 'hex', 'utf8');
  const plainText = text + decrypt.final('utf8');
  // eslint-disable-next-line no-control-regex
  const result = plainText.replace(/[\x00-\x20]+/g, '');
  return JSON.parse(result);
}

const pointsController = {
  getPoints: async (req, res, next) => {
    try {
      const pointsRepo = dataSource.getRepository('PointsPlan');
      const points = await pointsRepo.find({ select: ['points', 'value'] });
      if (!points) {
        logger.warn('取得點數資料錯誤:', '點數資料不存在');
        return next(appError(400, '點數資料不存在'));
      }
      res.status(200).json({
        status: 'success',
        data: points,
      });
    } catch (error) {
      logger.error('取得點數資料錯誤:', error);
      appError(500, '取得點數資料錯誤');
      next(error);
    }
  },
  purchasePoints: async (req, res, next) => {
    try {
      const { id } = req.user;
      const { pointsPlan } = req.body;

      const membersRepo = dataSource.getRepository('Members');
      const user = await membersRepo.findOneBy({ id });

      if (!user) {
        logger.warn('使用者不存在:', id);
        return next(appError(404, '使用者不存在'));
      }

      const pointsPlanRepo = dataSource.getRepository('PointsPlan');
      const plan = await pointsPlanRepo.findOneBy({ value: pointsPlan.value });

      if (!plan) {
        logger.warn('點數方案不存在:', pointsPlan.value);
        return next(appError(404, '點數方案不存在'));
      }

      const timeStamp = Math.floor(Date.now() / 1000);
      const TradeInfo = {
        TimeStamp: timeStamp,
        Amt: pointsPlan.value,
        email: user.email,
        ItemDesc: 'points',
        MerchantOrderNo: timeStamp,
      };

      // 使用 AES 進行加密
      const aesEnc = createMpgAesEncrypt(TradeInfo);

      // 使用 SHA-256 進行雜湊
      const shaEnc = createMpgShaEncrypt(aesEnc);

      const pointsOrderRepo = dataSource.getRepository('PointsOrder');
      const pointsOrder = pointsOrderRepo.create({
        merchant_order_no: timeStamp,
        member_id: id,
        points_plan_id: plan.id,
        amount: pointsPlan.value,
        trade_no: null, // 初始為 null，待支付完成後更新
        pay_time: null, // 初始為 null，待支付完成後更新
        status: 'pending',
      });

      await pointsOrderRepo.save(pointsOrder);
      logger.info('點數訂單已儲存:', pointsOrder);

      // 加密資訊返回前端
      res.status(200).json({
        status: 'success',
        data: {
          MerchantID,
          varsion: Version,
          TradeInfo: aesEnc,
          TradeSha: shaEnc,
        },
      });
    } catch (error) {
      logger.error('購買點數資料錯誤:', error);
      next(appError(500, '購買點數資料錯誤'));
    }
  },
  newebpayNotify: async (req, res, next) => {
    try {
      const { Status, TradeInfo, Message } = req.body;

      if (Status !== 'SUCCESS' && Message !== '授權成功') {
        logger.warn('新支付返回錯誤:', '交易狀態不為成功');
        return next(appError(400, '授權失敗'));
      }

      const { TradeNo, MerchantOrderNo, PayTime } = createMpgAesDecrypt(TradeInfo).Result;
      const pointsOrderRepo = dataSource.getRepository('PointsOrder');
      const pointsOrder = await pointsOrderRepo.findOne({
        where: { merchant_order_no: MerchantOrderNo },
        relations: ['pointsPlan'],
      });

      if (!pointsOrder) {
        logger.warn('新支付返回錯誤:', '點數訂單不存在');
        return next(appError(400, '點數訂單不存在'));
      }

      const userRepo = dataSource.getRepository('Members');
      const user = await userRepo.findOneBy({ id: pointsOrder.member_id });

      if (!user) {
        logger.warn('新支付返回錯誤:', '使用者不存在');
        return next(appError(404, '使用者不存在'));
      }

      // 更新點數訂單狀態
      pointsOrder.status = 'completed';
      pointsOrder.trade_no = TradeNo;
      pointsOrder.pay_time = parseNewebpayTime(PayTime);
      await pointsOrderRepo.save(pointsOrder);
      logger.info('點數訂單已更新:', pointsOrder);

      // 更新使用者點數餘額
      user.points += pointsOrder.pointsPlan.value;
      await userRepo.save(user);
      logger.info('使用者點數已更新:', user.id, '新增點數:', pointsOrder.pointsPlan.value);

      // 更新使用者點數異動紀錄
      const pointsRecordsRepo = dataSource.getRepository('PointsRecord');
      const pointsRecord = pointsRecordsRepo.create({
        member_id: user.id,
        points_change: pointsOrder.pointsPlan.value,
        points_order_id: pointsOrder.id,
        recordType: 'addPoint',
      });
      await pointsRecordsRepo.save(pointsRecord);
      logger.info('點數異動紀錄:', pointsRecord);

      logger.info('新支付通知處理完成:', '交易狀態為成功');
      res.status(200).json({
        status: 'success',
        message: '交易成功',
      });
    } catch (error) {
      logger.error('新支付返回錯誤:', error);
      next(appError(500, '新支付返回錯誤'));
    }
  },
  newebpayReturn: async (req, res, next) => {
    try {
      const { Status, TradeInfo, Message } = req.body;
      const { MerchantOrderNo } = createMpgAesDecrypt(TradeInfo).Result;

      // 輪詢等待 notify 處理完成
      let order = null;
      const maxAttempts = 60; // 最多嘗試 60 次
      const delayMs = 500; // 每次等待 500ms (總共最多等待 30 秒)

      for (let i = 0; i < maxAttempts; i++) {
        const pointsOrderRepo = dataSource.getRepository('PointsOrder');
        order = await pointsOrderRepo.findOne({
          where: { merchant_order_no: MerchantOrderNo },
          relations: ['member', 'pointsPlan'],
        });

        // 檢查訂單是否已完成處理
        if (order && (order.status === 'completed' || order.status === 'failed')) {
          logger.info(`訂單: ${MerchantOrderNo}, 狀態: ${order.status}, 等待次數: ${i + 1}`);
          break;
        }

        // 如果還在處理中，等待一下再檢查
        if (i < maxAttempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }

      if (!order) {
        logger.error('查無訂單:', MerchantOrderNo);
        return res.redirect(
          `https://dev.shuttler.tw/buy-points/callback?status=fail&message=OrderNotFound`,
        );
      }

      if (order.status !== 'completed') {
        logger.error('訂單處理超時或失敗:', MerchantOrderNo, order.status);
        return res.redirect(
          `https://dev.shuttler.tw/buy-points/callback?status=timeout&merchantOrderNo=${MerchantOrderNo}`,
        );
      }

      if (Status !== 'SUCCESS') {
        return res.redirect(
          `https://dev.shuttler.tw/buy-points/callback?status=fail&message=${encodeURIComponent(Message)}`,
        );
      }

      // 導向前端成功頁面
      const redirectUrl = `https://dev.shuttler.tw/buy-points/callback?status=success&pointsValue=${order.pointsPlan.value}&userPoints=${order.member.points}&merchantOrderNo=${MerchantOrderNo}`;

      logger.info(`重定向到: ${redirectUrl}`);
      res.redirect(redirectUrl);
    } catch (error) {
      logger.error('新支付返回錯誤:', error);
      next(appError(500, '新支付返回錯誤'));
      // console.error('新支付返回錯誤:', error);
    }
  },
};

module.exports = pointsController;
