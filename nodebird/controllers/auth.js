const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');

// 회원가입 컨트롤러
exports.join = async (req, res, next) => {
    const { email, nick, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { email } });
        // 기존에 같은 이메일로 가입한 사용자가 있으면,
        if (exUser) { 
            // 회원가입 페이지로 되돌리기.
            // 단, 주소 뒤에 에러를 쿼리스트링으로 표시.
            return res.redirect('/join?error=exist');   
        }
        // 회원 가입 시 비밀번호는 암호화해서 저장한다.
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');

    } catch (error) {
        console.log(error);
        return next(error);
    }
}

// 로그인 컨트롤러
exports.login = (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {    // authError 값이 있다면(.. 로그인 중에 오류 발생)
            console.log(authError);
            return next(authError);
        }
        if (!user) {    // user값(사용자 정보)이 없다면(.. 인증 실패)
            return res.redirect(`/?loginError=${info.message}`);
        }
        // 로그인에 성공한 경우,
        // req.login()을 사용하여 사용자 정보를 세션에 저장
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    }) (req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙인다.
};

// 로그아웃 컨트롤러
exports.logout = (req, res) => {
    // req.logout 메소드는 req.user객체와 req.session 객체를 제거한다.
    req.logout(() => {
        res.redirect('/');
    });
};

// 비밀번호 확인
exports.checkPwd = async (req, res, next) => {
    const { password } = req.body;
    const exUser = await User.findOne({ where: { id: req.user.id, } });
    if (exUser) {
        const result = await bcrypt.compare(password, exUser.password);
        if (result) {
            return res.send({ isCorrected : true });
        }
    }
    return res.send({ isCorrected : false });

}

// 프로필 수정
exports.update = async (req, res, next) => {
    const{ email, nick, password } = req.body;
    console.log(req.body);

    const exUser = await User.findOne({ where: { id: req.user.id, } });
    if (exUser) {
        exUser.update({ 
            email: email,
            nick: nick,
        });  
        if(password.length !== 0 && password !== null) {    
            const hash = await bcrypt.hash(password, 12);
            exUser.update({ password: hash });
        }
        
        return res.redirect('/');
    }
    return res.redirect('/profile?error=exist');  
}