const Sequelize = require('sequelize');

class Post extends Sequelize.Model {
    static initiate(sequelize) {
        Post.init({
            content: {
                type: Sequelize.STRING(140),
                allowNull: false,
            },
            img: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Post',
            tableName:'posts',
            paranoid: false,
            charset:'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        // 1(User) : N(Post) 관계
        db.Post.belongsTo(db.User, { foreignKey: 'UserId', as: 'Author' }); // UserId를 외래 키로 사용

        // N(Hashtag) : M(Post) 관계
        // 'PostHashtag'라는 중간 모델이 생긴다.
        // foreignKey는 각각 postId와 hashtagId.
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });

        // 좋아요 기능
        // N(User) : M(Post) 관계
        db.Post.belongsToMany(db.User, { through: 'LikeList', as: 'Likers' });
    }
}

module.exports = Post;