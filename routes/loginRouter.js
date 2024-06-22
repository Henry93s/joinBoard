const {Router} = require('express');
const passport = require('passport');
const path = require('path');
const router = Router();
const loginCheck = require('./middlewares/loginCheck');
const dotenv = require('dotenv');
dotenv.config();
// (JWT-1) login 성공 시 token 생성 및 클라이언트로 전달
const jwt = require('jsonwebtoken'); // passport-jwt
const secret = process.env.COOKIE_SECRET;

const setUserToken = (res, user) => {
    const token = jwt.sign(user, secret);
    res.cookie('token', token);
}

const asyncHandler = (requestHandler) => {
    return async (req,res,next) => {
        try {
            await requestHandler(req, res);
        } catch(e){
            next(e);
        }
    }
}

router.get('/', (req, res) => {
    console.log("login here");
    res.sendFile(path.join(__dirname + '/../public/login.html'));
});
/* (JWT-0) 로그인 구현으로 세션만 false 처리 */
router.post('/auth', loginCheck, passport.authenticate('local', {session: false}), (req, res, next) => {
    setUserToken(res, req.user); // (JWT-1) login 성공 시 token 생성 및 클라이언트로 전달

    if(req.user && req.user.passwordReset) {
        res.redirect('/updatePwRequired');
        return;
    }
    res.redirect('/');
});

// 3. /login/google 접근 시 구글 로그인 페이지로 넘어감
router.get('/google', passport.authenticate('google',{
    scope: ['profile', 'email']
}));

// 3. 로그인 완료 후 로그인 정보를 아래 콜백(/login/google/collback) 으로 전달함
router.get('/google/callback', passport.authenticate('google', {
    session: false
}), (req, res, next) => {
    if(req.user){
        console.log("google-OAuth");
        setUserToken(res, req.user);
        res.redirect('/');
    } else if(!req.user){
        res.send('<script>alert("구글 로그인에 실패하였습니다."); window.location.href = "/login";</script>')
    }
})



module.exports = router;