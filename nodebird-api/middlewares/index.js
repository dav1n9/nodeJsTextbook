// 로그인 여부를검사하는 미들웨어

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {    // 로그인 중이면
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`);
    }
};