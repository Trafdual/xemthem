var myMD = require("../models/sanpham.model");
var myMDBlog = require("../models/blog.model");




async function resizeImage(buffer, width, height) {
  const originalSize = Math.ceil(Math.sqrt(buffer.length / 4));
  const newSize = Math.ceil(width * height);

  if (newSize >= originalSize) {
    // Không giảm kích thước nếu kích thước mới lớn hơn hoặc bằng kích thước gốc
    return buffer;
  }

  const pixelRatio = originalSize / newSize;
  const step = Math.floor(Math.sqrt(pixelRatio));
  const newBuffer = Buffer.alloc(newSize * 4);

  for (let i = 0; i < newSize; i++) {
    const srcIdx = i * step * 4;
    const destIdx = i * 4;

    if (srcIdx < buffer.length) {
      newBuffer[destIdx] = buffer[srcIdx];
      newBuffer[destIdx + 1] = buffer[srcIdx + 1];
      newBuffer[destIdx + 2] = buffer[srcIdx + 2];
      newBuffer[destIdx + 3] = buffer[srcIdx + 3];
    } else {
      // Nếu vượt qua kích thước gốc, điền các giá trị mặc định
      newBuffer[destIdx] = 0;
      newBuffer[destIdx + 1] = 0;
      newBuffer[destIdx + 2] = 0;
      newBuffer[destIdx + 3] = 255; // Alpha channel
    }
  }

  return newBuffer;
}


exports.home = async (req, res, next) => {
  let list_TL = await myMD.spModel.find();
  let list_BL = await myMDBlog.blogModel.find();
  res.render("home/index.ejs", { listSP: list_TL, listBL: list_BL });
};

exports.shop = async (req, res, next) => {
  let list_TL = await myMD.spModel.find();
  res.render("home/shop.ejs", { listSP: list_TL });
};
exports.home2 = async (req, res, next) => {
  let list_TL = await myMD.spModel.find();
  let list_BL = await myMDBlog.blogModel.find();
  res.render("home/shop2.ejs", { listSP: list_TL, listBL: list_BL  });
};
exports.contact = async (req, res, next) => {
  let list_TL = await myMD.spModel.find();
  res.render("home/contact.ejs", { listSP: list_TL });
};
exports.thanhtoan = async (req, res, next) => {
  let list_TL = await myMD.spModel.find();
  res.render("home/thanhtoan.ejs", { listSP: list_TL });
};
exports.searchByName = async (req, res, next) => {
  const searchQuery = req.query.search;
  const regex = new RegExp(searchQuery, 'i');

  try {
    const searchResults = await myMD.spModel.find({ name: regex });
    const searchResultsBlog = await myMDBlog.blogModel.find({ tieude_blog: regex });

    res.render('home/home.ejs', { listSP: searchResults, listBL: searchResultsBlog });
  } catch (error) {
    console.error(error);
    res.render('home/home.ejs', { listSP: [], listBL: [] });
  }
};


exports.add = async (req, res, next) => {
  let msg = "";
  console.log(req.body);
  if (req.method == "POST") {
    let objSP = new myMD.spModel();

    try {
      // Đọc buffer của ảnh từ req.file
      const imageBuffer = req.file.buffer;

      // Thực hiện điều chỉnh kích thước (ví dụ: giảm kích thước xuống 800x600)
      const resizedBuffer = await resizeImage(imageBuffer, 600, 400);

      // Chuyển đổi buffer thành base64
      objSP.img = resizedBuffer.toString('base64');
    } catch (error) {
      msg = error.message;
    }

    objSP.name = req.body.name;
    objSP.noidung = req.body.noidung;
    objSP.price = req.body.price;
    objSP.GPU = req.body.GPU;
    objSP.kichthuocmanhinh = req.body.kichthuocmanhinh;
    objSP.congnghemanhinh = req.body.congnghemanhinh;
    objSP.camerasau = req.body.camerasau;
    objSP.cameratruoc = req.body.cameratruoc;
    objSP.chip = req.body.chip;
    objSP.bonho = req.body.bonho;
    objSP.pin = req.body.pin;
    objSP.hedieuhanh = req.body.hedieuhanh;
    objSP.dophangiai = req.body.dophangiai;
    objSP.tinhnangmanhinh = req.body.tinhnangmanhinh;
    objSP.quayvideo = req.body.quayvideo;
    objSP.tinhnangcamera = req.body.tinhnangcamera;
    objSP.kichthuoc = req.body.kichthuoc;
    objSP.trongluong = req.body.trongluong;
    objSP.congnghesac = req.body.congnghesac;
    objSP.congsac = req.body.congsac;
    objSP.kieumanhinh = req.body.kieumanhinh;
    objSP.tinhnagdacbiet = req.body.tinhnagdacbiet;
    objSP.loai = req.body.loai;

    //ghi vào CSDL
    try {
      let new_sp = await objSP.save();
      console.log(new_sp);
      msg = "Lưu thành công";
      res.redirect("/main");

    } catch (error) {
      console.log(error);
    }
  }



  res.render("home/add.ejs", { msg: msg });
};

exports.addblog = async (req, res, next) => {
  let msg = "";
  console.log(req.body);
  if (req.method == "POST") {
    let objSP = new myMDBlog.blogModel();

    try {
      // Đọc buffer của ảnh từ req.file
      const imageBuffer = req.file.buffer;

      // Thực hiện điều chỉnh kích thước (ví dụ: giảm kích thước xuống 800x600)
      const resizedBuffer = await resizeImage(imageBuffer, 600, 400);

      // Chuyển đổi buffer thành base64
      objSP.img_blog = resizedBuffer.toString('base64');
    } catch (error) {
      msg = error.message;
    }

    objSP.tieude_blog = req.body.tieude_blog;
    objSP.noidung_blog = req.body.noidung_blog;


    //ghi vào CSDL
    try {
      let new_sp = await objSP.save();
      console.log(new_sp);
      msg = "Lưu thành công";
      res.redirect("/main");

    } catch (error) {
      console.log(error);
    }
  }



  res.render("home/addblog.ejs", { msg: msg });
};
exports.addJsonBlog = async (req, res, next) => {
  let msg = "";
  console.log(req.body);
  if (req.method == "POST") {
    let objSP = new myMDBlog.blogModel();

    try {
      // Đọc buffer của ảnh từ req.file
      const imageBuffer = req.file.buffer;

      // Thực hiện điều chỉnh kích thước (ví dụ: giảm kích thước xuống 800x600)
      const resizedBuffer = await resizeImage(imageBuffer, 600, 400);

      // Chuyển đổi buffer thành base64
      objSP.img_blog = resizedBuffer.toString('base64');
    } catch (error) {
      msg = error.message;
    }

    objSP.tieude_blog = req.body.tieude_blog;
    objSP.noidung_blog = req.body.noidung_blog;


    try {
      let new_sp = await objSP.save();
      console.log(new_sp);
      msg = "Lưu thành công";
    } catch (error) {
      msg = "Error" + error.message();
      console.log(error);
    }
  }
  res.send({ message: msg });
};
exports.deleteBlog = async (req, res, next) => {
  let idblog = req.params.idblog;
  try {
    await myMDBlog.blogModel.findByIdAndDelete(idblog);
  } catch (error) { }
  res.redirect("/main");

};


exports.deleteJsonBlog = async (req, res, next) => {
  let idblog = req.params.idblog;
  if (req.method === "DELETE") {
    try {
      await myMDBlog.blogModel.findByIdAndDelete({ _id: idblog });
    } catch (error) { }
  }
  res.send({ message: 'Xóa thành công' });
};
exports.editBlog = async (req, res, next) => {
  let msg = "";

  // Load thông tin sản phẩm
  let idblog = req.params.idblog;
  let objSP = await myMDBlog.blogModel.findById(idblog);

  if (req.method === "POST") {
    try {
      if (req.file) {
        objSP.img = req.file.buffer.toString('base64');
        console.log(msg);
      }
    } catch (error) {
      msg = error.message;
    }

    objSP.tieude_blog = req.body.tieude_blog;
    objSP.noidung_blog = req.body.noidung_blog;
    try {
      await objSP.save();
      msg = "Cập nhật thành công";
      res.redirect("/main");

    } catch (error) {
      console.log(error);
    }
  }

  res.render("home/editBlog.ejs", { msg: msg, objSP: objSP });
};
exports.editBlogJson = async (req, res, next) => {
  let msg = "";

  let idblog = req.params.idblog;
  let objSP = await myMDBlog.blogModel.findById(idblog);

  if (req.method == "PUT") {

    objSP.tieude_blog = req.body.tieude_blog;
    objSP.noidung_blog = req.body.noidung_blog;

    try {
      let new_sp = await objSP.save();
      console.log(new_sp);
      msg = "Sửa thành công";
    } catch (error) {
      msg = "Error" + error.message();
      console.log(error);
    }
  }

  res.send({ message: msg });
};
exports.chitietblog = async (req, res, next) => {
  let idblog = req.params.idblog;
  let objSP = await myMDBlog.blogModel.findById(idblog);
  let listBL = await myMDBlog.blogModel.find();
  res.render("home/chitietblog.ejs", { objSP: objSP, listBL: listBL });
};

//////////

exports.addJson = async (req, res, next) => {
  let msg = "";
  console.log(req.body);
  let objSP = new myMD.spModel();

  if (req.method == "POST") {

    objSP.img = req.body.img;
    objSP.name = req.body.name;
    objSP.noidung = req.body.noidung;
    objSP.price = req.body.price;
    objSP.GPU = req.body.GPU;
    objSP.kichthuocmanhinh = req.body.kichthuocmanhinh;
    objSP.congnghemanhinh = req.body.congnghemanhinh;
    objSP.camerasau = req.body.camerasau;
    objSP.cameratruoc = req.body.cameratruoc;
    objSP.chip = req.body.chip;
    objSP.bonho = req.body.bonho;
    objSP.pin = req.body.pin;
    objSP.hedieuhanh = req.body.hedieuhanh;
    objSP.dophangiai = req.body.dophangiai;
    objSP.tinhnangmanhinh = req.body.tinhnangmanhinh;
    objSP.quayvideo = req.body.quayvideo;
    objSP.tinhnangcamera = req.body.tinhnangcamera;
    objSP.kichthuoc = req.body.kichthuoc;
    objSP.trongluong = req.body.trongluong;
    objSP.congnghesac = req.body.congnghesac;
    objSP.congsac = req.body.congsac;
    objSP.kieumanhinh = req.body.kieumanhinh;
    objSP.tinhnagdacbiet = req.body.tinhnagdacbiet;
    objSP.loai = req.body.loai;

    try {
      let new_sp = await objSP.save();
      console.log(new_sp);
      msg = "Lưu thành công";
    } catch (error) {
      msg = "Error" + error.message();
      console.log(error);
    }
  }
  res.send({ message: msg });
};

exports.edit = async (req, res, next) => {
  let msg = "";

  // Load thông tin sản phẩm
  let idsp = req.params.idsp;
  let objSP = await myMD.spModel.findById(idsp);

  if (req.method === "POST") {
    try {
      if (req.file) {
        objSP.img = req.file.buffer.toString('base64');
        console.log(msg);
      }
    } catch (error) {
      msg = error.message;
    }

    // Cập nhật thông tin sản phẩm
    objSP.name = req.body.name;
    objSP.noidung = req.body.noidung;
    objSP.price = req.body.price;
    objSP.GPU = req.body.GPU;
    objSP.kichthuocmanhinh = req.body.kichthuocmanhinh;
    objSP.congnghemanhinh = req.body.congnghemanhinh;
    objSP.camerasau = req.body.camerasau;
    objSP.cameratruoc = req.body.cameratruoc;
    objSP.chip = req.body.chip;
    objSP.bonho = req.body.bonho;
    objSP.pin = req.body.pin;
    objSP.hedieuhanh = req.body.hedieuhanh;
    objSP.dophangiai = req.body.dophangiai;
    objSP.tinhnangmanhinh = req.body.tinhnangmanhinh;
    objSP.quayvideo = req.body.quayvideo;
    objSP.tinhnangcamera = req.body.tinhnangcamera;
    objSP.kichthuoc = req.body.kichthuoc;
    objSP.trongluong = req.body.trongluong;
    objSP.congnghesac = req.body.congnghesac;
    objSP.congsac = req.body.congsac;
    objSP.kieumanhinh = req.body.kieumanhinh;
    objSP.tinhnagdacbiet = req.body.tinhnagdacbiet;
    objSP.loai = req.body.loai;

    try {
      await objSP.save();
      msg = "Cập nhật thành công";
      res.redirect("/main");

    } catch (error) {
      console.log(error);
    }
  }

  res.render("home/edit.ejs", { msg: msg, objSP: objSP });
};

exports.editJson = async (req, res, next) => {
  let msg = "";

  let idsp = req.params.idsp;
  let objSP = await myMD.spModel.findById(idsp);

  if (req.method == "PUT") {

    objSP.img = req.body.img;
    objSP.name = req.body.name;
    objSP.noidung = req.body.noidung;
    objSP.price = req.body.price;
    objSP.GPU = req.body.GPU;
    objSP.kichthuocmanhinh = req.body.kichthuocmanhinh;
    objSP.congnghemanhinh = req.body.congnghemanhinh;
    objSP.camerasau = req.body.camerasau;
    objSP.cameratruoc = req.body.cameratruoc;
    objSP.chip = req.body.chip;
    objSP.bonho = req.body.bonho;
    objSP.pin = req.body.pin;
    objSP.hedieuhanh = req.body.hedieuhanh;
    objSP.dophangiai = req.body.dophangiai;
    objSP.tinhnangmanhinh = req.body.tinhnangmanhinh;
    objSP.quayvideo = req.body.quayvideo;
    objSP.tinhnangcamera = req.body.tinhnangcamera;
    objSP.kichthuoc = req.body.kichthuoc;
    objSP.trongluong = req.body.trongluong;
    objSP.congnghesac = req.body.congnghesac;
    objSP.congsac = req.body.congsac;
    objSP.kieumanhinh = req.body.kieumanhinh;
    objSP.tinhnagdacbiet = req.body.tinhnagdacbiet;
    objSP.loai = req.body.loai;

    try {
      let new_sp = await objSP.save();
      console.log(new_sp);
      msg = "Sửa thành công";
    } catch (error) {
      msg = "Error" + error.message();
      console.log(error);
    }
  }

  res.send({ message: msg });
};

exports.deleteSP = async (req, res, next) => {
  let idsp = req.params.idsp;
  try {
    await myMD.spModel.findByIdAndDelete(idsp);
  } catch (error) { }
  res.redirect("/main");

};


exports.deleteJson = async (req, res, next) => {
  let idsp = req.params.idsp;
  if (req.method === "DELETE") {
    try {
      await myMD.spModel.findByIdAndDelete({ _id: idsp });
    } catch (error) { }
  }
  res.send({ message: 'Xóa thành công' });
};
exports.chitiet = async (req, res, next) => {
  let idsp = req.params.idsp;
  let objSP = await myMD.spModel.findById(idsp);
  let listSP = await myMD.spModel.find();
  res.render("home/single-product.ejs", { objSP: objSP, listSP: listSP });
};



