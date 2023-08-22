const express = require('express');
const path = require('path');

const app = express();
// 서버가 실행될 포트를 설정
// process.env 객체에 PORT 속성이 있다면 그 값을 사용하고, 
// 없다면 3000번 포트를 이용
app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
    //res.send('Hello Express');
    res.sendFile(path.join(__dirname, '/index.html'));
});

// app.set(키, 값) 으로 데이터 저장
// app.get(키) 로 데이터 가져오기

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});