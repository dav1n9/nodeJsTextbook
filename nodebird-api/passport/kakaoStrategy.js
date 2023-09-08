const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports = () => {
    passport.use(new kakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',     // 사용자가 Kakao OAuth 인증을 완료한 후 리디렉션되는 URL
    }, async (accessToKen, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        try {
            const exUser = await User.findOne({
                where: { snsId: profile.id, provider: 'kakao' },
            });
            if (exUser) {               // 기존에 카카오를 통해 회원 가입한 사용자가 있다면
                done(null, exUser);     // 사용자 정보와 함께 done 함수를 호출하고, 전략 종료.
            } else {                    // 없다면, 회원가입 진행.
                const newUser = await User.create({
                    email: profile._json?.kakao_account?.email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });
                done(null, newUser);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};