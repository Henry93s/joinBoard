const {Schema} = require('mongoose');
const {nanoid} = require('nanoid');
// 중복 없는 문자열을 생성해주는 nanoid

const makeDate = () => {
    return new Date().toLocaleString();
};

const userSchema = new Schema({
    __id: {
        type: String,
        default: () => { return nanoid() },
        require: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createAt: {
        type: String,
        default: () => { return makeDate() },
        require: true
    },
    updateAt: {
        type: String,
        default: () => { return makeDate() },
        require: true
    },
    passwordReset: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

module.exports = userSchema;