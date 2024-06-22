const {Router} = require('express');
const {Post, User} = require('../models/index');
const path = require('path');
const router = Router();
const editRouter = require('./posts/editRouter');
const deleteRouter = require('./posts/deleteRouter');
const loginRequired = require('./middlewares/loginRequired');

const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
        try{
            await requestHandler(req, res);
        } catch(err) {
            next(err);
        }
    }
};

// 수정 삭제 추가 라우팅으로 해결 ( edit required 라우터 거침 확인
//, delete required 라우터는 /delete 를 거치지 않고 fetch 에서 요청하는 부분이므로 req.user 검사로 확인해서 front 에서 해결 
// -> editRouter 는 해당 라우터로 이동 전에 체크하지만, deleteRouter는 해당 라우터로 이동하는 개념이 아닌 js 함수가 실행되는 불가함)
router.use('/edit', loginRequired, editRouter);
router.use('/delete', deleteRouter);
// 특정 글 읽기는 req.params 로 결정되는데 :__id 등등은 추가 라우팅으로 만들 수 없음 
// router.use('/:__id', viewRouter);

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + `/../public/posts.html`));
});

// 모든 글 리스트 읽기 && 내 글만 보기 라우터
router.get('/getdatas', asyncHandler(async (req,res) => { 
    if(req.user && req.query.myposts === 'true'){
        // 내 글만 보기
        const {__id} = req.user;
        const user = await User.find({__id});
        // pagination
        // page query 가 없으면 1 을 사용하고 없으면 있는 값 사용 !!
        const page = Number(req.query.page || 1);
        const perPage = 5; 
        // 여기서 sort 는 몽구스 전용 sort !
        const posts = await Post.find({author: user}).sort(({createAt: -1})).skip(perPage * (page - 1))
        .limit(perPage).populate('author');
        // pupulate 를 추가하여 User 의 objectID 와 같은 데이터를 JOIN
        const total = await Post.countDocuments({author: user});
        const totalPage = Math.ceil(total/perPage);
    
        const data = {
            page: page,
            perPage: perPage,
            total: total,
            posts: posts,
            totalPage: totalPage
        };
        res.json(data);
        return;
    } else if(!req.user && req.query.myposts === 'true'){
        const data = {mypostsresult: "err"};
        res.json(data);
        return;
    }
    else {
        // 모든 글 보기
        const page = Number(req.query.page || 1);
        const perPage = 5; 
        const posts = await Post.find().sort(({createAt: -1})).skip(perPage * (page - 1))
        .limit(perPage).populate('author');
        const total = await Post.countDocuments();
        const totalPage = Math.ceil(total/perPage);
    
        const data = {
            page: page,
            perPage: perPage,
            total: total,
            posts: posts,
            totalPage: totalPage
        };
        res.json(data);
        return;
    }
}));

// 특정 글 읽기는 req.params 로 결정되는데 :__id 등등은 추가 라우팅으로 만들 수 없음 
// 특정 글 읽기 라우터 (+ 댓글 목록 읽기 라우터 api 내용도 추가 작성)
router.get('/:__id', (req, res) => {
    res.sendFile(path.join(__dirname + "/../public/view.html"));
});

// 글 내용 요청 라우터 (+ 댓글 내용 요청 추가)
router.get('/:__id/getdatas', asyncHandler(async (req, res) => {
    const query = {
        __id: req.params.__id
    };

    const post = await Post.findOne(query).populate('author');
    // 댓글 내용 read 추가
    
    await User.populate(post.comments, {
        path: 'author'
    });
    
    res.json(post);
}));

// 댓글 등록 라우터
router.post('/:__id/comments', asyncHandler(async (req, res) => {
    const __id = req.params.__id;
    const {content} = req.body;
    if(!req.user){res.json({result: 'fail'}); return;}

    const author = await User.findOne({
        __id: req.user.__id
    });
    if(!content) {
        res.json({result:'noncontent'}); return;
    }
    if(!author) { res.json({result:'Session user can\'t find in UserDB'}); return; }
    const createAt = new Date().toLocaleString();
    const updateAt = new Date().toLocaleString();

    // $push 오퍼레이터 : 글에 동시에 추가되는 댓글 요청 처리
    const post = await Post.findOneAndUpdate({
        __id: __id
    },{
        $push: {comments:{
            content,
            author,
            createAt,
            updateAt
        }},
    }, {new: true} ); // 적용된 문서 반환할 때 사용
    // 일반적으로 csr api 는 render, send 를 직접하지 않고, front 로 json 만 넘겨준다.

    res.status(200).json({result: 'success'}); 
}));
// 글 수정하기, 글 삭제하기 위 라우터 체크

module.exports = router;