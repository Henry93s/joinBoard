const {Router} = require('express');
const {Post} = require('../../models/index');
const router = Router();

const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
        try {
            await requestHandler(req, res);
        } catch (err) {
            next(err);
        }
    }
}

// fetch
router.delete('/:__id', asyncHandler(async (req, res) => {
    if(!req.user){
        res.statusCode = 401;
        res.json({deletes: "notlogin"});
        return;
    }

    const query = {
        __id: req.params.__id
    };
    const post = await Post.findOne(query).populate('author');
    if(post.author.email === req.user.email){
        await Post.deleteOne(query);
        res.statusCode = 201;
        res.status(200).json({deletes: "ok"});
        return;
    } else {
        res.statusCode = 400;
        res.status(403).json({deletes: "notok"});
    }
}));

module.exports = router;