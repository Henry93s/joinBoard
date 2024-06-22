const {Router} = require('express');
const {User} = require('../models/index');
const generateRandomValue = require('../api/generateRandomValue');
const path = require('path');
const crypto = require('crypto');
const sendEmail = require('../api/nodemailer');
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

const checkEmail = (email) => {
    if(!/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)){
        return false;
    }
    return true;
}

// findPassword , 비밀번호 찾기를 통한 임시 비밀번호 요청
router.post('/', asyncHandler(async (req, res) => {
    const {findEmail} = req.body; // email address
    const emailCheck = checkEmail(findEmail);
    if(emailCheck === false){
        throw new Error('이메일 형식이 올바르지 않습니다. 다시 확인해주세요.');
    }
    const user = await User.findOne({email: findEmail});
    if(!user){
        throw new Error('해당 사용자가 존재하지 않습니다. 다시 확인해주세요.');
    }
    
    const randomPassword = generateRandomValue("password");
    const pwHash = crypto.createHash('sha256').update(randomPassword).digest('hex');
    await User.findOneAndUpdate({email: findEmail}, {
        password: pwHash,
        passwordReset: true,
    });
    console.log(findEmail, randomPassword);
    const subject = "게시판 임시 비밀번호를 확인하세요. 로그인 시 초기화가 필요합니다.";
    const text = `임시 비밀번호 : ${randomPassword}\n임시 비밀번호로 로그인 시 패스워드 초기화 기능이 동작합니다.`;
    const result = await sendEmail(findEmail, subject, text);
    if(result === -1){
        throw new Error('메일이 정상 발송되지 않았습니다.');
    } else if(result === 1){
        res.send(`<script>alert('메일이 정상 발송되었습니다. 메일을 확인해주세요.');
        window.location.href = '/login';</script>`);
        return;
    }
}));

module.exports = router;
