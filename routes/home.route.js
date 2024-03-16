const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home.controller');
const multer = require('multer');
const { route, render } = require('..');
const storage = multer.memoryStorage();
const uploader = multer({ storage: storage });


router.get('/search', homeController.searchByName);

// BLOG
router.get('/addblog', homeController.addblog);
router.post('/addblog', uploader.single('image'), homeController.addblog);
router.post('/addblog2', homeController.addJsonBlog);

router.get('/home/editBlog/:idblog', homeController.editBlog);
router.post('/home/editBlog/:idblog', uploader.single('image'), homeController.editBlog);
router.put('/home/editBlog2/:idblog', homeController.editBlogJson);

router.get('/home/deleteBlog/:idblog', homeController.deleteBlog);
router.post('/home/deleteBlog/:idblog', homeController.deleteBlog);
router.delete('/home/deleteBlog2/:idblog', homeController.deleteJsonBlog);
//
router.get('/chitietblog/:idblog', homeController.chitietblog);
router.post('/chitietblog/:idblog', homeController.chitietblog);

router.get('/shop/', homeController.shop);
router.get('/contact/', homeController.contact);
router.get('/thanhtoan/', homeController.thanhtoan);

module.exports = router;
