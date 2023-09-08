const { v4: uuidv4 } = require('uuid'); // 패키지의 변수나 함수를 불러올 대 이름을 바꾸는 방법 (v4 -> uuidv4)
const { User, Domain } = require('../models');

exports.renderLogin = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: { id: req.user?.id || null },
            include: { model: Domain },
        });
        res.render('login', {
            user,
            domains: user?.Domains,
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
}

exports.createDomain = async (req, res, next) => {
    try {
        await Domain.create({
            UserId: req.user.id,
            host: req.body.host,
            type: req.body.type,
            clientSecret: uuidv4(),
        });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
};