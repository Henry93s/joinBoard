const {Router} = require('express');
const path = require('path');
const crypto = require('crypto');
const {User} = require('../models/index');
const sendEmail = require('../api/nodemailer');
const generateRandomValue = require('../api/generateRandomValue');
const {Verify} = require('../models/index');

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
    console.log("join here");
    res.sendFile(path.join(__dirname + '/../public/join.html'));
});

// 최종 회원 가입 승인 요청
router.post('/', asyncHandler(async (req, res) => {
    const {email, name, password, password_confirm} = req.body;

    const pwHash = crypto.createHash('sha256').update(password).digest('hex');
    const exists = await User.findOne({email});
    if(exists) {
        throw new Error("이미 가입된 이메일입니다.");
    }
    const verify = await Verify.findOne({code: "email", input: email});
    if(!verify || verify.check === false) {
        throw new Error("이메일 인증이 진행되지 않았습니다. 인증을 진행해주세요.")
    }
    
    if(name.length < 2){
        throw new Error('최소 2자리 이상의 이름을 설정해 주세요.');
    }

    if(password.length < 8){
        throw new Error('최소 8자리 이상의 비밀번호를 설정해 주세요.');
    }
    else if(!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*#?&`~$^()_+])[A-Za-z\d@!%*#?&`~$^()_+]{8,}$/.test(password)){
        throw new Error('비밀번호는 영문 + 숫자 + 특수문자의 조합으로 설정해 주세요.');
    }

    if(password !== password_confirm) {
        throw new Error('비밀번호 확인이 일치하지 않습니다.');
    }

    await Verify.deleteMany(verify);
    await User.create({email, name, password: pwHash});

   res.redirect('/');
}));

// 이메일 인증 메일 보내기(인증코드 전송)
router.post('/verify', asyncHandler(async (req,res) =>{
    const {email} = req.body;
    if(!/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)){
        //res.status(400);
        res.json({result: "nontype"});
        return;
    }
    const user = await User.findOne({email});
    if(user) {
        //res.status(400);
        res.json({result: "user"});
        return;
    }

    const secret = generateRandomValue("verifycode");
    console.log(email, secret);

    const subject = "join 회원 가입 인증 코드를 확인하세요.";
    const text = `인증 코드 : ${secret}\n인증 코드를 이메일 인증번호에 입력하고 [이메일 인증 확인] 을 진행해주세요.`;
    const result = await sendEmail(email, subject, text);
    if(result === 1){
        res.status(200);
        // 이메일 인증 코드 값 저장 (있을 경우 재클릭이므로 지웠다가 다시 생성한다.)
        const code = req.body.code;
        const verify = await Verify.findOne({code, input: email});
        if(!verify){
            await Verify.create({code, input: email, secret});
        } else {
            await Verify.deleteMany(verify);
            await Verify.create({code, input: email, secret});
        }
        res.json({result: "ok", verifycode: secret});
        return;
    } else if (result === -1){
        res.status(400);
        res.json({result: "fail"});
        return;
    }
}));

router.post('/verify/:email_confirm', asyncHandler(async (req, res) => {
    const {code, input, secret} = req.body;
    if(!input || !secret){
        res.json({result: "fail"});
        return;
    }

    const verify = await Verify.findOne({code, input});
    if(verify && secret === verify.secret){
        await Verify.updateOne(verify, {check: true});
        res.json({result: "ok"});
        return;
    } else{
        await Verify.updateOne(verify, {check: false});
        res.json({result: "fail"});
    }
}));

module.exports = router;