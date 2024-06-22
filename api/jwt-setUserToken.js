const jwt = require('jsonwebtoken');
const secret = process.env.COOKIE_SECRET;

const setUserToken = (user) => {
    return jwt.sign(user, secret);
}