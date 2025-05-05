const passport = require('passport');
const bcrypt = require('bcrypt');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const { dataSource } = require('../db/data-source');
const config = require('./index');

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.get('jwt.jwtSecret'),
};

passport.use(
  new JWTStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const member = await dataSource.getRepository('Members').findOne({
        where: { id: jwtPayload.id },
      });

      if (member) {
        return done(null, member);
      }
      return done(null, false, {
        message: '請先登入',
        statusCode: 401,
      });
    } catch (error) {
      return done(error, false);
    }
  }),
);

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const member = await dataSource.getRepository('Members').findOne({
          where: { email },
          select: ['id', 'name', 'email', 'password'],
        });

        if (!member) {
          return done(null, false, {
            message: '帳號或密碼輸入錯誤',
            statusCode: 400,
          });
        }
        const isMatch = await bcrypt.compare(password, member.password);

        if (!isMatch) {
          return done(null, false, {
            message: '帳號或密碼輸入錯誤',
            statusCode: 400,
          });
        }

        return done(null, member);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

module.exports = passport;
