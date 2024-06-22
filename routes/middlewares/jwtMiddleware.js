const passport = require('passport');

// (JWT-3) jwt 토큰은 기본적으로 모든 요청에 포함되며, 요청에 토큰이 있는 경우 로그인 상태로 처리하기 위한 미들웨어를 추가함.
// app.use((req, res, next) => {~~  } 과 동일 )
module.exports = (req, res, next) => {
    // authenticate 를 하지 않고 next() 되었기 때문에 req.user 에 빈 값이 있을거임
    if(!req.cookies.token) {
        next();
        return;
    }
    return passport.authenticate('jwt', { session: false })(req,res,next);
    // req 에 토큰이 있는경우 anthenticate(인증) 를 하고 req.user 에 저장해주게 된다. 인증 성공 이후 next() 하게 되어 모든 페이지에서 req.user 에 따른 대응이 가능해진다.
};