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
        const { name,manhinh,chip,ram,dungluong,camera,pinsac,hang,congsac,thongtin } = req.body;
        const tensp = new LoaiSP.TenSP({ name,manhinh,chip,ram,dungluong,camera,pinsac,hang,congsac,thongtin });
        await tensp.save();
        res.redirect("/main");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
    
});

router.post('/putloaisp/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name, manhinh, chip, ram, dungluong, camera, pinsac, hang,congsac,thongtin } = req.body;
        await LoaiSP.TenSP.findByIdAndUpdate(id, { name, manhinh, chip, ram, dungluong, camera, pinsac, hang, congsac,thongtin });
        res.redirect("/main");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
});

router.get('/editloaisp/:id', async (req, res) => {
    try {
        const id=req.params.id;
        const tensp = await LoaiSP.TenSP.findById(id);
        res.render("home/editloaisp.ejs",{tensp});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
    
});

router.get('/addloaisp', async (req, res) => {
    try {
        res.render("home/addloaisp.ejs");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
    
});

router.get('/addsp/:idloaisp', async (req, res) => {
    try {
        const idloaisp=req.params.idloaisp;
        res.render("home/add.ejs",{idloaisp});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
    
});


router.get('/main',checkAuth, async (req, res) => {
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
        // res.json(tenspjson);
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
        res.redirect('/main');
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
        res.render('home/chitietsp.ejs', {chitiet,idloaisp})
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
        res.render('home/shop.ejs', {chitiet,idloaisp})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
})

router.get('/getchitiet/:idsp/:idloai', async (req, res) => {
    try {
        const idsp = req.params.idsp;
        const idloai=req.params.idloai;
        const sp = await Sp.ChitietSp.findById(idsp);
        if (!sp) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
        const loai = await LoaiSP.TenSP.findById(idloai);
        if (!loai) {
            return res.status(404).json({ message: 'Không tìm thấy loại sản phẩm' });
        }

        const spjson={
            image:sp.image,
            name:sp.name,
            price:sp.price,
            content:sp.content,
            manhinh:loai.manhinh,
            chip:loai.chip,
            ram:loai.ram,
            dungluong:loai.dungluong,
            camera:loai.camera,
            pinsac:loai.pinsac,
            congsac:loai.congsac,
            hang:loai.hang,
            thongtin:loai.thongtin,
        }
        const mangloai = await Promise.all(sp.chitiet.map(async (mang) => {
            return {
                name: mang.name,
                price: mang.price
            };
        }));

        const mangjson = {
            spjson: spjson,
            mangloai: mangloai
        };
        // res.json(mangjson)
        res.render('home/single-product.ejs', {mangjson})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
})


router.post('/postloaichitiet/:chitietspid', async (req, res) => {
    try {
        const chitietspid = req.params.chitietspid;
        const { name, price } = req.body;
        const chitietsp = await Sp.ChitietSp.findById(chitietspid);
        chitietsp.chitiet.push({ name, price});
        await chitietsp.save();
        res.redirect(`/getloaichitiet/${chitietspid}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
})
router.post('/deleteloaichitiet/:chitietspid/:id', async (req, res) => {
    try {
        const chitietspid = req.params.chitietspid;
        const id=req.params.id
        const chitietsp = await Sp.ChitietSp.findById(chitietspid);
        const updatedChitiet = chitietsp.chitiet.filter(item => item._id != id);

        chitietsp.chitiet = updatedChitiet;
    
        await chitietsp.save();
        res.redirect(`/getloaichitiet/${chitietspid}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
})

router.get('/getaddloaichitiet/:chitietspid', async(req,res)=>{
    try {
        const chitietspid = req.params.chitietspid;
        res.render('home/addloaichitiet.ejs',{chitietspid})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
})

router.get('/getloaichitiet/:idsp', async (req, res) => {
    try {
        const idsp = req.params.idsp;
        const sp = await Sp.ChitietSp.findById(idsp);
        if (!sp) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
        const mangloai = await Promise.all(sp.chitiet.map(async (mang) => {
            return {
                _id:mang._id,
                name: mang.name,
                price: mang.price
            };
        }));

        // res.json(mangjson)
        res.render('home/loaichitietsp.ejs', {mangloai,idsp})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
})


router.post('/deletechitietsp/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const chitietsp = await Sp.ChitietSp.findById(id);
        if (!chitietsp) {
            return res.status(404).json({ message: 'Không tìm thấy chi tiết sản phẩm' });
        }
        const loaisp = await LoaiSP.TenSP.findById(chitietsp.idloaisp);
        loaisp.chitietsp = loaisp.chitietsp.filter(chitiet => chitiet.toString() !== id);
        await loaisp.save();

        await Sp.ChitietSp.deleteOne({ _id: id });

        res.redirect('/main');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
});

router.post('/updatechitietsp/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const {name, content, price } = req.body;

        const chitietsp = await Sp.ChitietSp.findById(id);
        if (!chitietsp) {
            return res.status(404).json({ message: 'Không tìm thấy chi tiết sản phẩm' });
        }

        chitietsp.content = content;
        chitietsp.price = price;
        chitietsp.name=name

        await chitietsp.save();

        res.redirect("/main");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
});

router.get('/editsp/:id', async (req, res) => {
    try {
        const id=req.params.id;
        const sp = await Sp.ChitietSp.findById(id);
        res.render("home/edit.ejs",{sp});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
    
});



module.exports = router;