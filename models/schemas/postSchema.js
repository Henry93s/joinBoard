const {Schema} = require('mongoose');
const {nanoid} = require('nanoid');
// 중복 없는 문자열을 생성해주는 nanoid

const makeDate = () => {
    return new Date().toLocaleString();
};

// sub-schema 작성 (댓글 테이블)
const CommentSchema = new Schema({
    content: String,
    __id: {
        type: String,
        default: () => { return nanoid() },
        require: true,
        index: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
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
    }
}, {
    timestamps: true
});


const postSchema = new Schema({
    __id: {
        type: String,
        default: () => { return nanoid() },
        require: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
    comments: [CommentSchema]
},{
    timestamps: true
});

module.exports = postSchema;