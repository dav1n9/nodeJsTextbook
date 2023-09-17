const request = require('supertest');
const { sequelize } = require('../models');
const app = require('../app');

// 모든 테스트를 실행하기 전에 수행해야 할 코드를 넣는 공간
beforeAll(async () => {
    await sequelize.sync();     // DB에 테이블을 생성
});

// 회원가입 테스트
describe('POST /join', () => {
    test('로그인 안 했으면 가입', (done) => {
        request(app)
            .post('/auth/join')
            .send({
                email: 'test1@test.com',
                nick: 'test1',
                password: '1234',
            })
            .expect('Location', '/')
            .expect(302, done);
             // request 함수는 비동기 함수이므로, jest가 테스트가 언제 종료되는지 스스로 판단하기 어려움.
            // 따라서 마지막에 test함수의 콜백 함수의 매개변수인 done을 
            // expect 메서드의 두번째 인자로 넣어서 테스트가 마무리되었음을 알려야 함.
    });
});

// 로그인한 상태에서 회원가입을 시도하는 경우를 테스트 
// (코드의 순서 중요! => 로그인 요청과 회원 가입 요청이 순서대로 이뤄져야 함.)
describe('POST /join', () => {
    const agent = request.agent(app);

    // 각각의 테스트 실행에 앞서 먼저 실행됨.
    // 로그인 수행.
    beforeEach((done) => {
        agent
            .post('/auth/login')
            .send({
                email: 'test1@test.com',
                password: '1234',
            })
            .end(done);
    });

    // 로그인된 agent로 회원 가입 테스트를 진행함.
    test('이미 로그인 했으면 redirect /', (done) => {
        const message = encodeURIComponent('로그인한 상태입니다.');
        agent
            .post('/auth/join')
            .send({
                email: 'test1@test.com',
                nick: 'test1',
                password: '1234',
            })
            .expect('Location', `/?error=${message}`)
            .expect(302, done);
    });
});

// 로그인 테스트
describe('POST /login', () => {
    test('가입되지 않은 회원', (done) => {
        const message = encodeURIComponent('가입되지 않은 회원입니다.');
        request(app)
            .post('/auth/login')
            .send({
                email: 'test111@test.com',
                password: '1234',
            })
            .expect('Location', `/?loginError=${message}`)
            .expect(302, done);
    });

    test('로그인 수행', (done) => {
        request(app)
            .post('/auth/login')
            .send({
                email: 'test1@test.com',
                password: '1234',
            })
            .expect('Location', '/')
            .expect(302, done);
    });

    test('비밀번호 틀림', (done) => {
        const message = encodeURIComponent('비밀번호가 일치하지 않습니다.');
        request(app)
            .post('/auth/login')
            .send({
                email: 'test1@test.com',
                password: '12345678',
            })
            .expect('Location', `/?loginError=${message}`)
            .expect(302, done);
    });
});

// 로그아웃
describe('GET /logout', () => {
    test('로그인되어 있지 않으면 403', (done) => {
        request(app)
            .get('/auth/logout')
            .expect(403, done);
    });

    const agent = request.agent(app);
    beforeEach((done) => {
        agent
            .post('/auth/login')
            .send({
                email: 'test1@test.com',
                password: '1234',
            })
            .end(done);
    });

    test('로그아웃 수행', (done) => {
        agent
            .get('/auth/logout')
            .expect('Location', '/')
            .expect(302, done);
    });
});


// 테스트 종료 시 데이터 정리하는 코드
afterAll(async () => {
    await sequelize.sync({ force: true });    // 테이블을 다시 만들게 하여 테이블을 초기화함.
});


/*
통합 테스트

하나의 라우터 통째로 테스트하기.
여러 개의 미들웨어와 다양한 라이브러리들이
모두 유기적으로 잘 작동하는지 테스트 하는 것.

supertest 패키지 사용
*/ 