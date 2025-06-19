const bcrypt = require('bcrypt');
const { dataSource } = require('../db/data-source');
const logger = require('../utils/logger')('Member');
const { isValidString, isValidPassword, isValidEmail } = require('../utils/validUtils');
const appError = require('../utils/appError');
const { generateJWT } = require('../utils/jwtUtils');
const config = require('../config');

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
};

module.exports = authController;
