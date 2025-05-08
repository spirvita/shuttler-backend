const passport = require('passport');
const bcrypt = require('bcrypt');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
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

passport.use(
  new GoogleStrategy(
    {
      clientID: config.get('google.googleClientId'),
      clientSecret: config.get('google.googleClientSecret'),
      callbackURL: config.get('google.googleCallbackURL'),
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { email, name } = profile._json;

        const member = await dataSource.getRepository('Members').findOne({
          where: { email },
        });
        if (member) {
          return done(null, member);
        }
        const salt = await bcrypt.genSalt(10);
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, salt);

        const newMember = await dataSource.getRepository('Members').create({
          name,
          email,
          password: hashedPassword,
        });
        const savedMember = await dataSource.getRepository('Members').save(newMember);
        return done(null, savedMember);
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);

module.exports = passport;
