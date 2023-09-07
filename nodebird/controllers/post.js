const { Post, Hashtag } = require('../models');

exports.afterUploadImage = (req, res) => {
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}` });
};

exports.uploadPost = async (req, res, next) => {
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            UserId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s#]*/g);
        if (hashtags) {
            const result = await Promise.all(
                hashtags.map(tag => {
                    return Hashtag.findOrCreate({
                        where: { title: tag.slice(1).toLowerCase() },
                    })
                }),
            );
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// 게시글 삭제
exports.deletePost = async (req, res, next) => {
    console.log('req.params.postId', req.params.postId);
    console.log('req.user.id', req.user.id);
    try {
        const post = await Post.findOne({ 
            where: { 
                id: req.params.postId,
                UserId: req.user.id,
             } 
        });
        if (post) {
            post.destroy();
            res.send('success');
        } else {
            res.status(404).send('no post');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// 좋아요
exports.likePost = async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
        });
        if(post) {
            post.addLikers(req.user.id);
            const id = await post.getLikers();
            console.log('Likers Id', id);
            res.send('success to like');
        } else {
            res.status(404).send('no like');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }

};

// 좋아요 취소
exports.unlikePost = async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
        });
        if (post) {
            post.removeLikers(req.user.id);
            const id = await post.getLikers();
            console.log('Likers Id', id);
            
            res.send('success to unlike');
        } else {
            res.status(404).send('no unlike');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}