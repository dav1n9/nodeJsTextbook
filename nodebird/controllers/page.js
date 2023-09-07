const { query } = require('express');
const { User, Post, Hashtag } = require('../models');
const { sequelize } = require('../models');

exports.renderProfile = (req, res) => {
    res.render('profile', { title: '내 정보 - NodeBird' });
};

exports.renderJoin = (req, res) => {
    res.render('join', { title: '회원 가입 - NodeBird' });
};

exports.renderMain = async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            include: [{
                // 게시글 작성자 정보
                model: User,
                as: 'Author',
                attributes: ['id', 'nick'],
            }, {
                model: User,
                as: 'Likers',
                through: { attributes: ['UserId'] }, // 중간 테이블의 속성은 선택하지 않음
            },
            ],
            order: [['createdAt', 'DESC']],
        });
        // posts 정보 클라이언트로 보낼때,
        // 좋아요 정보 같이 보내야 함.

        res.render('main', {
            title: 'NodeBird',
            twits: posts,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.renderHashtag = async (req, res, next) => {
    const query = req.query.hashtag;
    if (!query) {
        return res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.findOne({ where: { title: query } });
        let posts = [];
        if (hashtag) {
            posts = await hashtag.getPosts({ include: [{ model: User }] });
        }
        
        return res.render('main', {
            title: `${query} | NodeBird`,
            twits: posts,
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
};