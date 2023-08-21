const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const users = {}; // 데이터 저장용

http.createServer(async (req, res) => {
    try {
        console.log(req.method, req.url);
        if(req.method === 'GET') {
            // 1. 주소가 / 이면
            if(req.url === '/') {
                // path.join : string 형식의 인자들을 현재 운영체제에 맞춰 경로를 설정해줌
                // __dirname : 현재 폴더 경로
                const data = await fs.readFile(path.join(__dirname, 'restFront.html'));
                res.writeHead(200, { 'Content-Type': 'Text/html; charset=utf-8 '});
                return res.end(data);
            } // 2. 주소가 /about 이면
            else if (req.url === '/about') { 
                const data = await fs.readFile(path.join(__dirname, 'about.html'));
                res.writeHead(200, { 'Content-Type' : 'text/html; charset=utf-8' })
                return res.end(data);
            } // 3. 주소가 /users 이면
            else if (req.url === '/users') { 
                res.writeHead(200, { 'Content-Type' : 'text/html; charset=utf-8' })
                return res.end(JSON.stringify(users));
            }
            // 4. 주소가 /도 /about도 /users 도 아니면
            try {
                const data = await fs.readFile(path.join(__dirname, req.url));
                return res.end(data);
            } catch (err) {
                // 404 Not Found Error
                // 주소에 해당하는 라우트를 찾지 못했다
            }
        } else if (req.method === 'POST') {
            if (req.url === '/user') {
                let body = '';
                req.on('data', (data) => {
                    body += data;
                });
                return req.on('end', () => {
                    console.log('POST 본문(Body):', body);
                    const { name } = JSON.parse(body);
                    const id = Date.now();
                    users[id] = name;
                    res.writeHead(201, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end('등록 성공');
                });
            }
        } else if (req.method === 'PUT') {
            if(req.url.startsWith('/user/')) {
                const key = req.url.split('/')[2];
                let body = '';
                req.on('data', (data) => {
                    body += data;
                });
                return req.on('end', () => {
                    console.log('PUT 본문 (Body): ', body);
                    users[key] = JSON.parse(body).name;
                    res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
                    return res.end(JSON.stringify(users));
                });
            }
        } else if (req.method === 'DELETE') {
            if(req.url.startsWith('/user/')) {
                const key = req.url.split('/')[2];
                delete users[key];
                res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
                return res.end(JSON.stringify(users));
            }
        }
        
        res.writeHead(404);
        return res.end('NOT FOUND');
    } catch (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(err.message);
    }
})
    .listen(8082, () => {
        console.log('8082번 포트에서 서버 대기 중입니다.');
    });