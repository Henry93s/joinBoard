const {Router} = require('express');
const path = require('path');
const {User} = require('../models/index');

const router = Router();

const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
        try {
            await requestHandler(req, res);
        } catch(err) {
            next(err);
        }
    }
}

router.get('/', (req, res) => {
    console.log("main here");
    res.sendFile(path.join(__dirname + '/../public/main.html'));
});

// session store LOGOUT
/*
router.get('/logout', async (req, res, next) => {
    req.logout((err) => {
        try{
            if(err){
                throw new Error("로그아웃 중 에러 발생");
            }
            // 직접 url 접근 방지 생각해보기
            res.send(`<script>alert('정상적으로 로그아웃 되었습니다.'); 
            window.location.replace('/');</script>`);
        } catch(err) {
            next(err);
        }
    });
});
*/

// (JWT-4) JWT LOGOUT
router.get('/logout', async (req, res, next) => {
    res.cookie('token', null, {
        maxAge: 0
    });
    res.json({result: "ok"});
});

router.get('/getdatas', asyncHandler(async (req, res) => {
    const users = await User.find().sort({createdAt: "desc"});
    const data = {
        users: users,
        session: req.user
    };
    res.json(data);
}));

module.exports = router;