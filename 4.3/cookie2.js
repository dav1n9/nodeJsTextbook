const http = require('http');
const fs = require('fs').promises;
const path = require('path');

// 쿠키 문자열 -> 자바스크립트 객체
const parseCookies = (cookie = '') => 
    cookie
        .split(';')
        .map(v => v.split('='))
        .reduce((acc, [k, v]) => {
            acc[k.trim()] = decodeURIComponent(v);
            return acc;
        }, {});


http.createServer(async (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    // GET /login
    // GET 요청인 경우 데이터를 쿼리스트링으로 보내기에
    // (ex. http://localhost:8084/login?name=davin)
    // URL 객체로 쿼리스트링 부분을 분석함.
    if(req.url.startsWith('/login')) {
        const url = new URL(req.url, 'http://localhost:8084');
        const name = url.searchParams.get('name');
        const expires = new Date();
        // 쿠키 유효 시간을 현재 시간 + 5분으로 설정
        expires.setMinutes(expires.getMinutes() + 5);
        res.writeHead(302, {
            Location: '/',
            // 쿠키에 들어가면 안되는 글자 ex. 줄바꿈, 한글..
            // 한글은 encodeURIComponent 으로 감싸서 넣는다.
            'Set-Cookie': `name=${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
        });
        res.end();

    } // 그 외의 경우 (/로 접속했을 때)
    else if (cookies.name) {  // name 이라는 쿠키가 있는 경우
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`${cookies.name}님 안녕하세요`);
    } else {    // name 이라는 쿠키가 없는 경우
        try {
            const data = await fs.readFile(path.join(__dirname, 'cookie2.html'));
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        } catch {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(err.message);
        }
    }
})
    .listen(8084, () => {
        console.log('8084번 포트에서 서버 대기 중입니다!');
    })