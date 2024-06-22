const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const local = require('./routes/data/loginStrategy');
const jwtlocal = require('./routes/data/jwtStrategy');
const googlelocal = require('./routes/data/googleStrategy');
const session = require('express-session');
const mongoose = require('mongoose');
const mainRouter = require('./routes/mainRouter');
const joinRouter = require('./routes/joinRouter');
const loginRouter = require('./routes/loginRouter');
const postsRouter = require('./routes/postsRouter');
const findPasswordRouter = require('./routes/findPasswordRouter');
const updatePwRequiredRouter = require('./routes/updatePwRequiredRouter');
const {User} = require('./models/index');
const jwtMiddleware = require('./routes/middlewares/jwtMiddleware');
const mongoStore = require('connect-mongo');
const loginRequireMiddle = require('./routes/middlewares/loginRequired');

const app = express();
dotenv.config();

// bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// 파일 src 경로 고정 static
app.use(express.static('public'));
app.use(cookieParser(process.env.COOKIE_SECRET));
// (JWT-0) 로그인 구현으로 세션 비활성화
/*
app.use(session({
    //secure: true,	// https 환경에서 만 session 정보를 주고 받도록 처리
    secret: process.env.COOKIE_SECRET, // 암호화하는 데 쓰일 키
    resave: false, // 세션을 언제나 저장할지 설정함
    saveUninitialized: true, // 세션에 저장할 내역이 없더라도 처음부터 세션을 생성할지 설정
    cookie: {	// 세션 쿠키 설정 (세션 관리 시 클라이언트에 보내는 쿠키)
      httpOnly: true, // 자바스크립트를 통해 세션 쿠키를 사용할 수 없도록 함
      Secure: true
    },
    store: mongoStore.create({ // sessionStore
        mongoUrl: process.env.MONGO_URI,
        dbName: "join",
        autoRemove: "native" // default
    }),
    name: 'session-cookie' // 세션 쿠키명 디폴트 값은 connect.sid 이지만 다른 이름을 줄 수도 있다.
	}
));
*/
/*
passport.serializeUser((user, done) => {
    console.log(user.email, user.name);
    const data = {
        email: user.email,
        name: user.name,
        __id: user.__id,
        passwordReset: user.passwordReset
    };
    done(null, data);
});
passport.deserializeUser(async (data, done) => {
    const {email} = data;
    console.log("현재 로그인 이메일 : " + email);
    try{
        const user = await User.findOne({email});
        if(!user){
            throw new Error('세션에 저장된 아이디를 통한 db 조회 결과가 없습니다.');
        }
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
*/
app.use(passport.initialize());
// passport initial and session
// (JWT-2) 로그인 strategy 만들고 app.js 에 사용 필수
passport.use(local);
passport.use(jwtlocal);
passport.use(googlelocal);
//app.use(passport.session());
// (JWT-3) 만들어진 jwt 를 모든 페이지에서 확인할 수 있도록 함
app.use(jwtMiddleware);

mongoose.connect(process.env.MONGO_URI,{
    dbName: "join"
})
.then( res => console.log("mongoDB join collection connected"))
.catch( err => console.log(err));
mongoose.connection.on('err', (err) => {
    console.log("mongoDB err");
});

app.use('/', mainRouter);
app.use('/login', loginRouter);
app.use('/join', joinRouter);
app.use('/posts', postsRouter);
app.use('/findPassword', findPasswordRouter);
app.use('/updatePwRequired', updatePwRequiredRouter);

app.use((err,req,res,next) => {
    res.set({
        'Content-Type': 'text/html',
        charset: 'utf-8'   
    });
    console.log(err + " 외부 error 발생");
    res.send(`<script>alert("${err.message}"); window.history.back();</script>`);
});

app.listen(process.env.PORT, () => {
    console.log(`${process.env.PORT} port connected`);
});