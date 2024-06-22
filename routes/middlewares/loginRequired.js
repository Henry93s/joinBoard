module.exports = (req, res, next) => {
    // 다음 라우터로 이동하기 전에 로그인이 안되어있다면 메인화면으로
    // 로그인이 되어있다면 다음 미들웨어로
    try{
        if(!req.user){
            console.log("login check");
            throw new Error('로그인이 필요합니다 !');
        } 
        next();
    } catch(e){
        next(e);
    }
}