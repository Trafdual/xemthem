const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home.controller');
const multer = require('multer');
const { route, render } = require('..');
const storage = multer.memoryStorage();
const uploader = multer({ storage: storage });
const checkAuth=require('../controllers/checkAuth')

router.get('/', homeController.home);
router.post('/', homeController.home);
router.get('/ttshop', homeController.home2);


router.get('/search', homeController.searchByName);

// SẢN PHẨM
router.get('/add', homeController.add);
router.post('/add', uploader.single('image'), homeController.add);
router.post('/add2', homeController.addJson);

router.get('/home/edit/:idsp', homeController.edit);
router.post('/home/edit/:idsp', uploader.single('image'), homeController.edit);
router.put('/home/edit2/:idsp', homeController.editJson);

router.get('/home/deleteSP/:idsp', homeController.deleteSP);
router.post('/home/deleteSP/:idsp', homeController.deleteSP);
router.delete('/home/delete2/:idsp', homeController.deleteJson);

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



router.get('/chitiet/:idsp', homeController.chitiet);
router.post('/chitiet/:idsp', homeController.chitiet);
router.get('/main/',checkAuth, homeController.main);
module.exports = router;
