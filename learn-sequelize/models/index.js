const Sequelize = require('sequelize');

const User = require('./user');
const Comment = require('./comment');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

// new Sequelize를 통해 MySQL 연결 객체를 생성함.
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;

db.User = User;
db.Comment = Comment;

User.initiate(sequelize);
Comment.initiate(sequelize);

User.associate(db);
Comment.associate(db);

module.exports = db;
