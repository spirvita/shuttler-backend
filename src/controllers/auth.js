const bcrypt = require('bcrypt');
const { dataSource } = require('../db/data-source');
const logger = require('../utils/logger')('Auth');
const { isValidString, isValidPassword, isValidEmail } = require('../utils/validUtils');
const appError = require('../utils/appError');
const { generateJWT } = require('../utils/jwtUtils');
const mailService = require('../services/mailService');
const crypto = require('crypto');
const config = require('../config');
const { MoreThan } = require('typeorm');

const authController = {
  signUp: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      if (!isValidString(name) || !isValidString(email) || !isValidString(password)) {
        logger.warn('註冊使用者錯誤:', '欄位未填寫正確');
        return next(appError(400, '欄位未填寫正確'));
      }

      if (!isValidEmail(email)) {
        logger.warn('註冊使用者錯誤:', 'Email 格式不正確');
        return next(appError(400, 'Email 格式不正確'));
      }

      if (name.length > 64) {
        logger.warn('註冊使用者錯誤:', '姓名長度超過64字');
        return next(appError(400, '姓名長度超過64字'));
      }

      if (!isValidPassword(password)) {
        logger.warn(
          '註冊使用者錯誤:',
          '密碼不符合規則，需要包含英文數字大小寫，無特殊字元，最短8個字，最長32個字',
        );
        return next(
          appError(
            400,
            '密碼不符合規則，需要包含英文數字大小寫，無特殊字元，最短8個字，最長32個字',
          ),
        );
      }

      const existingMember = await dataSource.getRepository('Members').findOne({
        where: {
          email,
        },
      });
      if (existingMember) {
        logger.warn('註冊使用者錯誤:', '此 Email 已經註冊');
        return next(appError(409, '此 Email 已經註冊'));
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newMember = await dataSource.getRepository('Members').create({
        name,
        email,
        password: hashedPassword,
      });

      const savedMember = await dataSource.getRepository('Members').save(newMember);
      logger.info('註冊使用者成功:', savedMember.id);

      const token = await generateJWT({ id: savedMember.id });

      res.status(201).json({
        message: '註冊成功',
        data: {
          user: {
            id: savedMember.id,
            name: savedMember.name,
          },
          token,
        },
      });
    } catch (error) {
      logger.error('註冊使用者錯誤:', error);
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      const user = req.user;
      const token = await generateJWT({ id: user.id });

      res.status(200).json({
        message: '登入成功',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          token,
        },
      });
    } catch (error) {
      logger.error('登入使用者錯誤:', error);
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      logger.info('登出使用者成功');
      res.status(200).json({
        message: '登出成功',
      });
    } catch (error) {
      logger.error('登出使用者錯誤:', error);
      next(error);
    }
  },
  googleAuthCallback: async (req, res, next) => {
    try {
      const { id, email, name } = req.user;
      const token = await generateJWT({ id });
      const frontendUrl = config.get('google.frontendUrl');

      res.redirect(
        `${frontendUrl}/auth/callback?token=${token}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`,
      );
    } catch (error) {
      logger.error('Google 登入錯誤:', error);
      next(error);
    }
  },
  resetPassword: async (req, res, next) => {
    try {
      const { id } = req.user;
      const { password, newPassword, checkNewPassword } = req.body;
      if (!isValidPassword(newPassword) || !isValidPassword(checkNewPassword)) {
        logger.warn(
          '重設密碼錯誤:',
          '密碼不符合規則，密碼長度必須至少 10 個字元，且至少包含 1 個數字和 1 個英文字母',
        );
        return next(
          appError(
            400,
            '密碼不符合規則，密碼長度必須至少 10 個字元，且至少包含 1 個數字和 1 個英文字母',
          ),
        );
      }

      if (newPassword !== checkNewPassword) {
        logger.warn('重設密碼錯誤:', '新密碼與確認新密碼不一致');
        return next(appError(400, '新密碼與確認新密碼不一致'));
      }

      const user = await dataSource
        .getRepository('Members')
        .createQueryBuilder('member')
        .addSelect('member.password')
        .where('member.id = :id', { id })
        .getOne();

      if (!user) {
        logger.warn('重設密碼錯誤:', '此 Email 未註冊');
        return next(appError(400, '此 Email 未註冊'));
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        logger.warn('重設密碼錯誤:', '舊密碼輸入錯誤');
        return next(appError(400, '舊密碼輸入錯誤'));
      }

      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        logger.warn('重設密碼錯誤:', '新密碼不能與舊密碼相同');
        return next(appError(400, '新密碼不能與舊密碼相同'));
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await dataSource.getRepository('Members').save(user);

      logger.info('修改密碼成功:', user.id);
      res.status(200).json({ message: '修改密碼成功' });
    } catch (error) {
      logger.error('重設密碼錯誤:', error);
      appError(500, '重設密碼失敗');
    }
  },
  forgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;
      if (!isValidEmail(email)) {
        logger.warn('忘記密碼錯誤:', 'Email 格式不正確');
        return next(appError(400, 'Email 格式不正確'));
      }

      const user = await dataSource.getRepository('Members').findOne({
        where: { email },
      });

      if (!user) {
        logger.warn('忘記密碼錯誤:', '此 Email 未註冊');
        return next(appError(400, '此 Email 未註冊'));
      }

      // 生成重設密碼的 token 和過期時間
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      const resetExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 分鐘後過期

      // 更新使用者資料庫中的重設密碼欄位
      user.reset_password_token = hashToken;
      user.reset_password_expiry = resetExpiry;

      await dataSource.getRepository('Members').save(user);

      // 生成重設密碼的 URL
      const resetUrl = `${config.get('web.frontendUrl')}/auth/reset-pwd?token=${resetToken}`;

      // 呼叫發送郵件服務
      try {
        await mailService.sendMail(
          email,
          '重設密碼請求',
          `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">密碼重設請求</h2>
            <p>親愛的會員您好，</p>
            <p>我們收到了您的密碼重設請求。請點擊下方連結重設您的密碼：</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}"
                 style="background-color: #007bff; color: white; padding: 12px 30px;
                        text-decoration: none; border-radius: 5px; display: inline-block;">
                重設密碼
              </a>
            </div>

            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              此連結將在 15 分鐘後失效。<br>
              如果您沒有請求重設密碼，請忽略此郵件。
            </p>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="color: #999; font-size: 12px;">
              此為系統自動發送的郵件，請勿直接回覆。
            </p>
          </div>
        `,
        );
      } catch (emailError) {
        logger.error('發送密碼重設郵件失敗:', emailError);
        // 如果發送郵件失敗，恢復使用者的重設密碼欄位
        user.reset_password_token = null;
        user.reset_password_expiry = null;
        await dataSource.getRepository('Members').save(user);
        return next(appError(500, '發送密碼重設郵件失敗'));
      }

      res.status(200).json({ message: '重設密碼連結已發送至信箱' });
    } catch (error) {
      logger.error('忘記密碼錯誤:', error);
      next(error);
    }
  },
  verifyResetToken: async (req, res, next) => {
    try {
      const { token } = req.params;

      if (!token || !isValidString(token)) {
        logger.warn('驗證重設密碼 token 錯誤:', 'token 未提供');
        return next(appError(400, 'token 未提供'));
      }

      const hashToken = crypto.createHash('sha256').update(token).digest('hex');

      // 查詢資料庫中是否存在有效的重設密碼 token
      const user = await dataSource.getRepository('Members').findOne({
        where: {
          reset_password_token: hashToken,
          reset_password_expiry: MoreThan(new Date()), // 檢查 token 是否未過期
        },
      });

      if (!user) {
        logger.warn('驗證重設密碼 token 錯誤:', '無效或已過期的 token');
        return next(appError(400, '無效或已過期的 token'));
      }
      res.status(200).json({ message: 'success' });
    } catch (error) {
      logger.error('驗證重設密碼 token 錯誤:', error);
      next(error);
    }
  },
  resetPwdWithToken: async (req, res, next) => {
    try {
      const { token, newPassword, checkNewPassword } = req.body;
      if (!token && !isValidString(token)) {
        logger.warn('重設密碼錯誤:', 'token 未提供');
        return next(appError(400, 'token 未提供'));
      }

      if (!isValidPassword(newPassword) || !isValidPassword(checkNewPassword)) {
        logger.warn(
          '重設密碼錯誤:',
          '密碼不符合規則，密碼長度必須至少 10 個字元，且至少包含 1 個數字和 1 個英文字母',
        );
        return next(
          appError(
            400,
            '密碼不符合規則，密碼長度必須至少 10 個字元，且至少包含 1 個數字和 1 個英文字母',
          ),
        );
      }

      if (newPassword !== checkNewPassword) {
        logger.warn('重設密碼錯誤:', '新密碼和確認密碼不一致');
        return next(appError(400, '新密碼和確認密碼不一致'));
      }

      const hashToken = crypto.createHash('sha256').update(token).digest('hex');

      // 查詢資料庫中是否存在有效的重設密碼 token
      const user = await dataSource.getRepository('Members').findOne({
        where: {
          reset_password_token: hashToken,
          reset_password_expiry: MoreThan(new Date()), // 檢查 token 是否未過期
        },
      });

      if (!user) {
        logger.warn('重設密碼錯誤:', '無效或已過期的 token');
        // 清除 token 和過期時間
        user.reset_password_token = null;
        user.reset_password_expiry = null;
        await dataSource.getRepository('Members').save(user);
        return next(appError(400, '無效或已過期的 token'));
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      user.reset_password_token = null;
      user.reset_password_expiry = null;

      await dataSource.getRepository('Members').save(user);
      logger.info('重設密碼成功:', user.id);
      res.status(200).json({ message: '密碼重設成功' });
    } catch (error) {
      logger.error('重設密碼錯誤:', error);
      next(error);
    }
  },
};

module.exports = authController;
