const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { afterUploadImage, uploadPost, deletePost, likePost, unlikePost } = require('../controllers/post');
const { isLoggedIn } = require('../middlewares');

const router = express.Router();

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

// POST /post/img
router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage);

// POST /post
const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), uploadPost);

// DELETE /post/:postId/delete
router.delete('/:postId/delete', isLoggedIn, deletePost);

// POST /post/:postId/like  // 좋아요
router.post('/:postId/like', isLoggedIn, likePost);

// POST /post/:postId/unlike  // 좋아요 취소
router.post('/:postId/unlike', isLoggedIn, unlikePost);


module.exports = router;