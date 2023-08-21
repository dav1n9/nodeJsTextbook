const http = require('http');

http.createServer((req, res) => {
    console.log(req.url, req.headers.cookie);
    // 응답의 헤더에 쿠키를 기록.
    res.writeHead(200, { 'Set-cookie': 'mycookie=test' });
    res.end('Hello Cookie');
})
    .listen(8083, () => {
        console.log('8083번 포트에서 서버 대기 중입니다.');
    });