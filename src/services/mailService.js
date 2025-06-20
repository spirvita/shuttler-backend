const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const logger = require('../utils/logger')('MAILSERVICE');
const appError = require('../utils/appError');
const config = require('../config');

const refreshToken = config.get('google.googleAuthRefreshToken');
const clientId = config.get('google.googleClientId');
const clientSecret = config.get('google.googleClientSecret');
const userEmail = config.get('google.userEmail');

const mailService = {
  sendMail: async (to, subject, html) => {
    try {
      if (!to || !subject || !html) {
        throw appError(400, '缺少必要的郵件參數');
      }
      const oAuth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        'https://developers.google.com/oauthplayground',
      );

      oAuth2Client.setCredentials({
        refresh_token: refreshToken,
      });

      const accessToken = await oAuth2Client.getAccessToken();

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: userEmail,
          clientId,
          clientSecret,
          refreshToken,
          accessToken,
        },
      });

      const mailOptions = {
        from: `羽神同行 <${userEmail}>`,
        to,
        subject,
        html,
      };

      const result = await transporter.sendMail(mailOptions);
      logger.info('郵件發送成功:', result.messageId);
      return result;
    } catch (error) {
      logger.error('郵件發送失敗:', error);
      throw appError(500, '郵件發送失敗');
    }
  },
};

module.exports = mailService;
