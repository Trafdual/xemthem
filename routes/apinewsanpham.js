const express = require('express');
const router = express.Router();
const Sp = require("../models/chitietSpModel");
const LoaiSP = require("../models/tenSpModel");
const multer = require('multer')
var myMDBlog = require("../models/blog.model");
const checkAuth=require('../controllers/checkAuth')

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.post('/postloaisp', async (req, res) => {
    try {
        const { name } = req.body;
        const tensp = new LoaiSP.TenSP({ name });
        const savedTensp = await tensp.save();
        res.json({ 
            id: savedTensp._id, // Sử dụng _id của đối tượng đã lưu
            name: savedTensp.name, // Thông tin về tên sản phẩm
            message: "Sản phẩm đã được lưu thành công!" 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
    
});

router.get('/main', async (req, res) => {
    try {
        let listloai = await LoaiSP.TenSP.find()
        let listblog = await myMDBlog.blogModel.find()
        res.render("home/home.ejs", { listloai, listblog });
    } catch (error) {
        console.log(`lỗi: ${error}`)
    }
});

router.get('/', async (req, res) => {
    try {
        const allsp = await LoaiSP.TenSP.find().populate('chitietsp');
        const listBl=await myMDBlog.blogModel.find();
        const tenspjson = await Promise.all(allsp.map(async (tensp) => {
            const chitietspJson = await Promise.all(tensp.chitietsp.map(async (chitietsp) => {
                return {
                    id: chitietsp._id,
                    name:chitietsp.name,
                    noidung: chitietsp.content,
                    price: chitietsp.price,
                    image:chitietsp.image
                }
            }));
            return {
                id: tensp._id,
                name: tensp.name,
                chitietsp: chitietspJson
            };
        }));
        res.render('home/index.ejs',{tenspjson,listBl});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
})


router.post('/deleteloaisp/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const xam = await LoaiSP.TenSP.findById(id);
        if (!xam) {
            res.status(403).json({ message: 'khong tim thay sp' })
        }
        await Promise.all(xam.chitietsp.map(async (chitietsp) => {
            await Sp.ChitietSp.findByIdAndDelete(chitietsp._id);
        }));
        await LoaiSP.TenSP.deleteOne({ _id: id });
        res.render('home/home.ejs');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
})

router.post('/postchitietsp/:id', upload.single('image'), async (req, res) => {
    try {
        const id = req.params.id;
        const { name, content, price } = req.body;
        const image = req.file.buffer.toString('base64');
        const chitietsp = new Sp.ChitietSp({ image, name, content, price });
        const tensp = await LoaiSP.TenSP.findById(id);
        if (!tensp) {
            res.status(403).json({ message: 'khong tim thay tensp' })
        }
        chitietsp.idloaisp = id;
        chitietsp.loaisp = tensp.name;
        tensp.chitietsp.push(chitietsp._id);
        await chitietsp.save();
        await tensp.save();
        res.redirect("/main");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
})

router.get('/getmausacsp/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const chitietsp = await Sp.ChitietSp.findById(id);
        if (!chitietsp) {
            return res.status(404).json({ message: 'Không tìm thấy chi tiết sản phẩm' });
        }
        const chitietspJson = chitietsp.mausac.map(async (chitiet) => {
            return {
                image: chitiet.image,
                color: chitiet.color,
                price: chitiet.price
            }
        })
        res.render('chitietsp', chitietspJson)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
})

router.get('/getchitietsp/:idloaisp', async (req, res) => {
    try {
        const idloaisp = req.params.idloaisp;
        const loaisp = await LoaiSP.TenSP.findById(idloaisp);
        if (!loaisp) {
            return res.status(404).json({ message: 'Không tìm thấy loại sản phẩm' });
        }

        const chitiet=await Promise.all(loaisp.chitietsp.map(async(ct)=>{
            const chitietsp=await Sp.ChitietSp.findById(ct._id);
            return{
                _id:chitietsp._id,
                image:chitietsp.image,
                name:chitietsp.name,
                content:chitietsp.content,
                price:chitietsp.price
            }
        }))
        res.render('home/chitietsp.ejs', {chitiet})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
})
router.get('/getspchitiet/:idloaisp', async (req, res) => {
    try {
        const idloaisp = req.params.idloaisp;
        const loaisp = await LoaiSP.TenSP.findById(idloaisp);
        if (!loaisp) {
            return res.status(404).json({ message: 'Không tìm thấy loại sản phẩm' });
        }

        const chitiet=await Promise.all(loaisp.chitietsp.map(async(ct)=>{
            const chitietsp=await Sp.ChitietSp.findById(ct._id);
            return{
                _id:chitietsp._id,
                image:chitietsp.image,
                name:chitietsp.name,
                content:chitietsp.content,
                price:chitietsp.price
            }
        }))
        res.render('home/shop.ejs', {chitiet})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
})
router.get('/getchitiet/:idsp', async (req, res) => {
    try {
        const idsp = req.params.idsp;
        const sp = await Sp.ChitietSp.findById(idsp);
        if (!sp) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
        const spjson={
            image:sp.image,
            name:sp.name,
            price:sp.price,
            content:sp.content
        }
// res.json(spjson)
        res.render('home/single-product.ejs', {spjson})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
})


router.post('/postmausac/:chitietspid', upload.single('image'), async (req, res) => {
    try {
        const chitietspid = req.params.chitietspid;
        const { color, price } = req.body;
        const chitietsp = await Sp.ChitietSp.findById(chitietspid);
        const image = req.file.buffer.toString('base64');
        chitietsp.mausac.push({ color, price, image });
        await chitietsp.save();
        res.status(200).json({ message: 'thêm màu thành công' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
})

router.delete('/deletechitietsp/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const chitietsp = await Sp.ChitietSp.findById(id);
        if (!chitietsp) {
            return res.status(404).json({ message: 'Không tìm thấy chi tiết sản phẩm' });
        }
        const loaisp = await LoaiSP.findById(chitietsp.idloaisp);
        loaisp.chitietsp = loaisp.chitietsp.filter(chitiet => chitiet.toString() !== id);
        await loaisp.save();

        await Sp.ChitietSp.deleteOne({ _id: id });

        res.json({ message: 'Xóa chi tiết sản phẩm thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
});

router.put('/updatechitietsp/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { content, price } = req.body;

        const chitietsp = await Sp.ChitietSp.findById(id);
        if (!chitietsp) {
            return res.status(404).json({ message: 'Không tìm thấy chi tiết sản phẩm' });
        }

        chitietsp.content = content;
        chitietsp.price = price;

        await chitietsp.save();

        res.json(chitietsp);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
});

module.exports = router;