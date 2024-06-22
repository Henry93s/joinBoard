const {Schema} = require('mongoose');
const {nanoid} = require('nanoid');

const makeDate = () => {
    return new Date().toLocaleString();
};

const verifySchema = new Schema ({
    code: String,
    input: String,
    secret: String,
    check: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = verifySchema;