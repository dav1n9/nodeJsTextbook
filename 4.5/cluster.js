const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

/*
cluster 모듈 : 싱글 프로세스로 동작하는 노드가 CPU 코어를 모두 사용할 수 있게 해주는 모듈

예기치 못한 에러로 인해 서버가 종료되는 현상을 방지할 수 있어 
클러스터링을 적용해두는 것이 좋다. (무중단 서비스)
실무에서는 pm2 등의 모듈을 사용하여 cluster 기능을 사용하곤 함.

*/

if(cluster.isMaster) {
    console.log(`마스터 프로세스 아이디 : ${process.pid}`);
    // cpu 개수만큼 워커 생산
    for(let i = 0; i < numCPUs; i += 1) {
        cluster.fork();
    }
    // 워커가 종료되었을 때
    cluster.on('exit', (worker, code, signal) => {
        console.log(`${worker.process.pid}번 워커가 종료되었습니다.`);
        console.log('code', code, 'signal', signal);

        // 워커 하나가 종료될 때마다 새로운 워커 생성하는 것은 좋지 않은 생각!
        //cluster.fork();
    });
} else {
    // 워커들이 포트에서 대기
    http.createServer((req,res) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.write('<h1>Hello Node!</h1>');
        res.write('<p>Hello Cluster!</p>');

        // 워커가 존재하는지 확인하기 위해 1초마다 강제 종료
        setTimeout(() => {
            process.exit(1);
        }, 1000);
    }).listen(8086);

    console.log(`${process.pid}번 워커 실행`);
}