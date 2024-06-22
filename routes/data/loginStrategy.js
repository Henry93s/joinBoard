const crypto = require('crypto');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const {User} = require('../../models/index');

// passport strategy setting
const config = {
    usernameField: 'email',
    passwordField: 'password'
};
const local = new LocalStrategy(config, async(email, password, done) => {
    try{
        const user = await User.findOne({email});
        if(!user) {
            throw new Error('회원을 찾을 수 없습니다.');
        }
        const pwHash = crypto.createHash('sha256').update(password).digest('hex');
        if(user.password !== pwHash) {
            throw new Error('비밀번호가 일치하지 않습니다.');
        }

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
});

module.exports = local;