const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { renderProfile, renderJoin, renderMain, renderHashtag } = require('../controllers/page');

const router = express.Router();

router.use((req, res, next) => {
    //  res.locals 객체는 뷰 템플릿 엔진에서 사용할 수 있는 로컬 변수를 저장하는 곳.
    res.locals.user = req.user;
    res.locals.followerCount = req.user?.Followers?.length || 0;
    res.locals.followingCount = req.user?.Followings?.length || 0;
    res.locals.followingIdList = req.user?.Followings?.map(f => f.id) || [];
    next();
});

router.get('/profile', isLoggedIn, renderProfile);

router.get('/join', isNotLoggedIn, renderJoin);

router.get('/', renderMain);

router.get('/hashtag', renderHashtag);

module.exports = router;
