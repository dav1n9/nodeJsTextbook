const Sequelize = require('sequelize');

class User extends Sequelize.Model {
    static initiate(sequelize) {
        User.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true,
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            provider: {
                // ENUM => 넣을 수 있는 값을 제한하는 데이터 형식
                type: Sequelize.ENUM('local', 'kakao'),
                allowNull: false,
                defaultValue: 'local',
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,   // createdAt, updatedAt 생성
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true,     // deletedAt 생성
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    
    static associate(db) {
        // 1(User) : N(Post) 관계
        db.User.hasMany(db.Post);

        // N(User(Follower)) : M(User(Following)) 관계
        // 같은 모델끼리도 N:M관계를 가질 수 있다 ex. 팔로잉기능
        // 'Follow'라는 중간 모델이 생긴다.
        db.User.belongsToMany(db.User, {    
            foreignKey: 'followingId',
            as: 'Followers',    // as는 foreignKey와 반대되는 모델을 가리켜야 함.
            through: 'Follow',
        });
        db.User.belongsToMany(db.User, {
            foreignKey: 'follwerId',
            as: 'Followings',
            through: 'Follow',
        });

        // 좋아요 기능
        // N(User) : M(Post) 관계
        db.User.belongsToMany(db.Post, { through: 'LikeList'});
    }
};

module.exports = User;