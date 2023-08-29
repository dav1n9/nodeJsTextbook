const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const indexRouter = require('./routes');
const userRouter = require('./routes/user');
const app = express();
// 서버가 실행될 포트를 설정
// process.env 객체에 PORT 속성이 있다면 그 값을 사용하고, 
// 없다면 3000번 포트를 이용
app.set('port', process.env.PORT || 3000);

// 인수로 dev 외에 combined, common, short, tiny 등을 넣을 수 있다.
app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie',
}));

app.use('/', indexRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message);
});

// app.set(키, 값) 으로 데이터 저장
// app.get(키) 로 데이터 가져오기

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});