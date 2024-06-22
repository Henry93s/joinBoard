module.exports = (req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password){
        throw new Error("이메일 혹은 패스워드를 입력하세요.");
    }

    if(!/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)){
        throw new Error('이메일 형식을 다시 확인해주세요.');
    }
    next();
}