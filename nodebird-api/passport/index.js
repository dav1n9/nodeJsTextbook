const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
    // 로그인 시 실행. (로그인에 성공하면)
    // req.session(세션) 객체에 어떤 데이터를 저장할지 정하는 메서드
    passport.serializeUser((user, done) => {
        done(null, user.id);    // 세션에 user.id 저장
    });

    // 각 요청마다 실행.
    // 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러온다.
    passport.deserializeUser((id, done) => {
        User.findOne({ 
            where: { id },
            include: [{
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followers',
            }, {
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followings',
            }],
         })
            .then(user => {done(null, user)}) // 조회된 사용자 정보를 req.user에 저장
            .catch(err => done(err));
    });

    local();
    // kakao();
}