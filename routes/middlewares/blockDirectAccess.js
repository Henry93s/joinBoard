module.exports = (req, res, next) => {
    // 이 미들웨어 함수를 거치지 않고 직접 접근하는 경우
    if (req.headers.referer === undefined) {
        res.status(403).send("Forbidden: Direct access not allowed");
    } else {
        // 다음 미들웨어로 이동
        next();
    }
};