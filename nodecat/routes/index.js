const express = require('express');
const { searchByHashtag, getMyPosts, renderMain, getFollowers, getFollowings } = require('../controllers');

const router = express.Router();

router.get('/myposts', getMyPosts);

router.get('/search/:hashtag', searchByHashtag);

router.get('/', renderMain);

router.get('/followers', getFollowers);

router.get('/followings', getFollowings);

module.exports = router;