const express = require('express');
const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { join, login, logout, checkPwd, update } = require('../controllers/auth');

const router = express.Router();

// POST /auth/join
router.post('/join', isNotLoggedIn, join);

// POST /auth/login
router.post('/login', isNotLoggedIn, login);

// GET /auth/logout
router.get('/logout', isLoggedIn, logout);

// GET /auth/kakao
router.get('/kakao', passport.authenticate('kakao'));

// GET /auth/kakao/callback
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/?loginError=카카오로그인 실패',      // 로그인 실패 시 리디렉션할 경로를 지정
}), ( req, res ) => {
    res.redirect('/');  // 성공 시에는 /로 이동
});

// POST /auth/checkPwd
router.post('/checkPwd', isLoggedIn, checkPwd);


// POST /auth/update
router.post('/update', isLoggedIn, update);

module.exports = router;