const mongoose = require('mongoose');
const userSchema = require('./schemas/userSchema');
const postSchema = require('./schemas/postSchema');
const verifySchema = require('./schemas/verifySchema');

exports.User = mongoose.model('User', userSchema);
exports.Post = mongoose.model('Post', postSchema);
exports.Verify = mongoose.model('Verify', verifySchema);