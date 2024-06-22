const {Router} = require('express');
const router = Router();
const path = require('path');
const {Post} = require('../../models/index');
const {User} = require('../../models/index');

const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
        try {
            await requestHandler(req, res);
        } catch(err) {
            next(err);
        }
    }
}

router.get('/', (req,res) => {
    res.sendFile(path.join(__dirname + `/../../public/edit.html`));
});

// 글 작성 작업 요청 라우터 (fetch 내에 선언된 라우팅 경로)
router.post('/', asyncHandler(async (req, res) => {
    const {title, content}= req.body;
    const author = await User.findOne({
        __id: req.user.__id
    });
    if(!author) { throw new Error('Session user can\'t find in UserDB'); }
    await Post.create({title, content, author});
    res.redirect('/posts?page=1&myposts=false');
}));


// wild card //
// 글 수정 페이지 내용 요청 라우터 (fetch 내에 선언된 라우팅 경로)
router.get('/:__id', asyncHandler(async (req, res) => {
    const query = {
        __id: req.params.__id
    };
    const post = await Post.findOne(query).populate('author');
    if(post.author.email === req.user.email){
        res.statusCode = 200;
        res.json(post);
        return;
    } else { 
        // 로그인은 되어 있으나 사용자가 작성한 글이 아닐 때
        res.statusCode = 400;
        res.json({edit:"notedit"});
    }
}));


// 글 수정 라우터 (fetch)
router.post('/:__id', asyncHandler(async (req, res) => {
    const {title, content}= req.body;
    const __id = req.params.__id;
    const author = await User.findOne({
        __id: req.user.__id
    });
    if(!author) { throw new Error('Session user can\'t find in UserDB'); }
    const updateAt = new Date().toLocaleString();
    // findOneAndUpdate?
    await Post.updateOne({__id},{title, content, updateAt});
    res.redirect('/posts?page=1&myposts=false');
}));


module.exports = router;