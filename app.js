const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
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

const multer = require('multer');
const fs = require('fs');

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});
app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'multipart.html'));
});
app.post('/upload', upload.single('image'), (req, res) => {
    console.log(req.file);
    res.send('ok');
});

app.use((req, res, next) => {
    console.log('모든 요청에 다 실행된다.');
    next();
});

// app.get('/', (req, res) => {
//     //res.send('Hello Express');
//     res.sendFile(path.join(__dirname, '/index.html'));
// });

app.get('/', (req, res, next) => {
    console.log('GET / 요청에서만 실행된다.');
    next();
}, (req, res) => {
    throw new Error('에러는 에러 처리 미들웨어로 간다.')
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