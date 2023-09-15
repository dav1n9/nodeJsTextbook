# nodeJsTextbook
Node.js교과서 따라하기


### 💡4장 : 

### 💡6장 : 

### 💡7장 [learn-sequelize](https://github.com/dav1n9/nodeJsTextbook/tree/main/learn-sequelize)
MySQL, sequelize

### 💡9장 [nodebird](https://github.com/dav1n9/nodeJsTextbook/tree/main/nodebird)
#### 익스프레스로 SNS 서비스 만들기
[기능]  

* 회원가입, 로그인(local, kakao)
* 게시글 작성, 사진 업로드
* 팔로잉
* 해시태그 검색

[추가 기능]

- [x] 팔로잉 끊기
- [x] 프로필 정보 변경하기
- [x] 게시글 좋아요 누르기 및 좋아요 취소하기
- [x] 게시글 삭제하기
- [ ] 사용자 이름을 누르면 그 사용자의 게시글만 보여주기
- [ ] 매번 데이터베이스를 조회하지 않도록 deserializeUser 캐싱하기


### 💡10장 [nodebird-api](https://github.com/dav1n9/nodeJsTextbook/tree/main/nodebird-api), [nodecat](https://github.com/dav1n9/nodeJsTextbook/tree/main/nodecat)
#### 웹 API 서버 만들기
#### 1. nodebird-api
* API 서비스를 제공하는 입장
#### 2. nodecat
* API 사용자 입장 (클라이언트)
#### 3. [API 명세서](https://davins-project.gitbook.io/nodebird-api/)
* gitbook 을 사용하여 작성함.
* 해당 [링크](https://davins-project.gitbook.io/nodebird-api/) 이동하여 확인 가능.

[추가 기능]
- [x] 팔로워나 팔로잉 목록을 가져오는 API 만들기 (nodebird-api에 새로운 라우터 추가)
- [ ] 무료인 도메인과 프리미엄 도메인 간에 사용량 제한을 다르게 적용하기
- [ ] 클라이언트용 비밀 키와 서버용 비밀 키를 구분해서 발급하기 (Domain 모델 수정)
- [x] 클라이언트를 위해 API 문서 작성하기 (gitbook 사용함)

### 💡11장
#### 노드 서비스 테스트하기