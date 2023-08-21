const http = require('http');   // 웹 브라우저 요청 처리를 위한 모듈

// 한번에 여러 서버 실행 가능

// 1. listen 메서드에 콜백 함수를 넣는 방법
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-type' : 'text/html; charset=utf-8' });
    res.write('<h1>Hello Node!</h1>');
    res.write('<p>Hello Server!</p>');
    res.end('<p>방법 1 : listen 메서드에 콜백 함수를 넣는 방법</p>');
})
    .listen(8080, () => {
        console.log('8080번 포트에서 서버 대기 중입니다!');
});


// 2. 서버에 listening 이벤트 리스너를 붙이는 방법
const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-type' : 'text/html; charset=utf-8' });
        res.write('<h1>Hello Node!</h1>');
        res.write('<p>Hello Server!</p>');
        res.end('<p>방법 2 : 서버에 listening 이벤트 리스너를 붙이는 방법</p>');
});
server.listen(8081);

server.on('listening', () => {
    console.log('8081번 포트에서 서버 대기 중입니다!');
});
server.on('error', (error) => {
    console.error(error);
});