const {Router} = require('express');
const {User} = require('../models/index');
const path = require('path');
const crypto = require('crypto');
const router = Router();

const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
        try {
            await requestHandler(req, res);
        } catch(err) {
            next(err);
        }
    }
};

router.get('/', (req,res) => {
    res.sendFile(path.join(__dirname + "/../public/updatePwRequired.html"));
});

// 임시 비밀번호 첫 로그인 후 비밀번호 변경 요청
router.post('/', asyncHandler(async (req, res) => {
    const {password, password_confirm} = req.body; // email address
    const email = req.user.email;

    if(password.length < 8){
        throw new Error('최소 8자리 이상의 비밀번호를 설정해 주세요.');
    }
    else if(!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*#?&`~$^()_+])[A-Za-z\d@!%*#?&`~$^()_+]{8,}$/.test(password)){
        throw new Error('비밀번호는 영문 + 숫자 + 특수문자의 조합으로 설정해 주세요.');
    }

    if(password !== password_confirm) {
        throw new Error('비밀번호 확인이 일치하지 않습니다.');
    }

    const pwHash = crypto.createHash('sha256').update(password).digest('hex');
    await User.findOneAndUpdate({email}, {
        password: pwHash,
        passwordReset: false,
    });
    console.log(email, password)
    res.redirect('/');
}));

module.exports = router;
