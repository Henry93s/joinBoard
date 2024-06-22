const googleStrategy = require('passport-google-oauth20');
const {User} = require('../../models/index');
const generateRandomValue = require('../../api/generateRandomValue');
const dotenv = require('dotenv');
dotenv.config();

const config = {
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_CLIENTPW,
    callbackURL: '/login/google/callback' 
};

const userFind = async ({email, name}) => {
    const user = await User.findOne({email});
    if(!user) {
        const createdUser = await User.create({
            email,
            name,
            password: generateRandomValue("password") // 사실상 임시 패스워드 
        });
        return createdUser;
    } else if(user) {
        return user;
    } 
}

// accessToken, refreshToken : 다른 구글 API 들을 사용하기 위한 토큰 사용하지 않아도 선언은 해야함 ! 
// (파라미터 위치에 따라 값이 완전히 달라지므로)
const googlelocal = new googleStrategy(config, 
    async (accessToken, refreshToken, profile, done) => {
        const {email, name} = profile._json;
        
        try{
            const user = await userFind({email, name});
            console.log(user);
            // done 콜백 함수 (error, 데이터);\
            done(null, {
                email: user.email,
                name: user.name,
                __id: user.__id,
                passwordReset: user.passwordReset
            });
            
        } catch(err) {
                done(err, null);
            }
    }
);

module.exports = googlelocal;