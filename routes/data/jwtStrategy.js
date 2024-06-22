// (JWT-2) 요청된 jwt 토큰의 서명을 확인하고 인증
const dotenv = require('dotenv');
dotenv.config();
const jwtStrategy = require('passport-jwt').Strategy;
const cookieExtractor = (req) => {
    const {token} = req.cookies;
    return token;
};

const opts = {
    secretOrKey: process.env.COOKIE_SECRET,
    jwtFromRequest: cookieExtractor
};

const jwtlocal = new jwtStrategy(opts, (user,done) => {
    done(null, user);
});

module.exports = jwtlocal;