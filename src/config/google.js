module.exports = {
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackURL: process.env.GOOGLE_CALLBACK_URL,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  googleAuthRefreshToken: process.env.GOOGLE_AUTH_REFRESH_TOKEN,
  userEmail: process.env.GOOGLE_USER_EMAIL || 'spirvita.tw@gmail.com',
};
