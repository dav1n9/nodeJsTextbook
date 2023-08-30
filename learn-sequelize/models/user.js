const Sequelize = require('sequelize');

class User extends Sequelize.Model {
    static initiate(sequelize) {
        User.init({
            name: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
            },
            age: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
            married: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            comment: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        }, {
            sequelize,
            timestamps: false,      // 자동으로 날짜 컬럼을 추가하는 기능
            underscored: false,     // 캐멀 케이스를 스네이크 케이스로 바꾸는 옵션
            modelName: 'User',
            tableName: 'users',
            paranoid: false,        // true로 설정하면 deletedAt 컬럼 생성됨. 로우 복원을 위함.
            charset: 'utf8',
            collate: 'utf8_general_ci',
            // utf8, utf8_general_ci로 설정해야 한글 입력 가능 
            // utf8mb4, utf8mb4_general_ci : 이모티콘까지 입력 가능
        });
    }

    static associate(db) {}
};

module.exports = User;