const passport = require('passport');

const authenticateLocal = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        message: info.message || '身份驗證失敗',
      });
    }
    req.user = user;
    return next();
  })(req, res, next);
};

const authenticateJWT = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        message: info.message || '身份驗證失敗',
      });
    }
    req.user = user;
    return next();
  })(req, res, next);
};

const optionalAuthenticateJWT = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (!err && user) {
      req.user = user;
    }

    // 無論有無user
    return next();
  })(req, res, next);
};

module.exports = { authenticateLocal, authenticateJWT, optionalAuthenticateJWT };
