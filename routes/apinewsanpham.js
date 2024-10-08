const express = require('express')
const router = express.Router()
const Sp = require('../models/chitietSpModel')
const LoaiSP = require('../models/tenSpModel')
var myMDBlog = require('../models/blog.model')
var theloaiblog = require('../models/theloaiblog')
const checkAuth = require('../controllers/checkAuth')
const unicode = require('unidecode')
const uploads = require('./upload')

router.get('/main', checkAuth, async (req, res) => {
  try {
    let blog = await theloaiblog.theloaiblogModel.find().lean()
    res.render('home/home.ejs', { blog })
  } catch (error) {
    console.log(`lỗi: ${error}`)
  }
})
router.get('/getblogtl/:idtheloai', async (req, res) => {
  try {
    const idtheloai = req.params.idtheloai
    const theloai = await theloaiblog.theloaiblogModel.findById(idtheloai)
    const blog = await Promise.all(
      theloai.blog.map(async tl => {
        const bl = await myMDBlog.blogModel.findById(tl._id)
        return {
          _id: bl._id,
          tieude_blog: bl.tieude_blog,
          img_blog: bl.img_blog
        }
      })
    )
    res.render('home/getblog.ejs', { blog, idtheloai })
  } catch (error) {
    console.log(`lỗi: ${error}`)
  }
})

router.get('/theloaiblog', async (req, res) => {
  try {
    const listtheloaiblog = await theloaiblog.theloaiblogModel.find()
    res.json(listtheloaiblog)
  } catch (error) {
    console.log(`lỗi: ${error}`)
  }
})

router.post('/posttlblog', async (req, res) => {
  try {
    const { name } = req.body
    const tl = new theloaiblog.theloaiblogModel({ name })
    await tl.save()
    res.json(tl)
  } catch (error) {
    console.log(`lỗi: ${error}`)
  }
})
router.get('/addtheloaiblog', async (req, res) => {
  res.render('home/addtlblog.ejs')
})

router.get('/contentBlog/:tieude', async (req, res) => {
  try {
    const tieude_khongdau = decodeURIComponent(req.params.tieude).replace(
      /-/g,
      ' '
    )
    const blog = await myMDBlog.blogModel.findOne({ tieude_khongdau })
    const allsp = await LoaiSP.TenSP.find().populate('chitietsp')

    if (!blog) {
      return res.status(404).json({ message: 'Blog không tồn tại' })
    }

    const listBl = await myMDBlog.blogModel.find().sort({ _id: -1 })

    const content = blog.noidung.map(noidung => {
      return {
        tieude: noidung.tieude,
        content: noidung.content.replace(/\\n/g, '<br>'),
        img: noidung.img || ''
      }
    })

    res.render('home/chitietblog.ejs', {
      content,
      tieude: blog.tieude_blog,
      listBl,
      image_blog: blog.img_blog,
      allsp
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` })
  }
})

router.get('/', async (req, res) => {
  try {
    // Lấy dữ liệu các thể loại
    const theloai = await theloaiblog.theloaiblogModel.find().lean()

    // Lấy dữ liệu các blog liên quan đến thể loại
    const flattenedListBl = await Promise.all(
      theloai.map(async tl => ({
        tentheloai: tl.name,
        blog: await Promise.all(
          tl.blog.map(async bl => {
            const blo = await myMDBlog.blogModel.findById(bl._id)
            return {
              _id: blo._id,
              tieude_blog: blo.tieude_blog,
              img_blog: blo.img_blog,
              tieude_khongdau: blo.tieude_khongdau
            }
          })
        )
      }))
    )

    res.render('home/blog.ejs', { flattenedListBl })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` })
  }
})

function escapeRegExp (string) {
  // Hàm thoát ký tự đặc biệt trong biểu thức chính quy
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function replaceKeywordsWithLinks (content, keywords, urlBase) {
  // Nếu keywords không phải là mảng, chuyển đổi nó thành mảng chứa một từ khóa duy nhất
  if (!Array.isArray(keywords)) {
    keywords = [keywords]
  }

  // Nếu không có từ khóa, trả lại nội dung gốc
  if (!keywords || keywords.length === 0) {
    return content
  }

  // Thay thế từng từ khóa bằng thẻ <a>
  keywords.forEach(keyword => {
    if (keyword === '') {
      return
    }
    // Thoát các ký tự đặc biệt trong từ khóa
    const escapedKeyword = escapeRegExp(keyword)
    // Tạo một biểu thức chính quy để tìm từ khóa
    const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'gi')
    // Thay thế từ khóa bằng thẻ <a> với đường link
    content = content.replace(regex, `<a href="${urlBase}">${keyword}</a>`)
  })

  return content
}
function removeSpecialChars (str) {
  // Danh sách các ký tự đặc biệt bạn muốn xóa
  const specialChars = /[:+,!@#$%^&*()-?/]/g // Thay đổi biểu thức chính quy theo các ký tự bạn muốn xóa

  // Xóa các ký tự đặc biệt
  return str.replace(specialChars, '')
}

router.post('/postblog/:idtheloai', async (req, res) => {
  try {
    const { tieude_blog, img, content, tieude, img_blog, keywords, urlBase } =
      req.body
    const idtheloai = req.params.idtheloai
    const theloai = await theloaiblog.theloaiblogModel.findById(idtheloai)
    const tieude_khongdau = unicode(tieude_blog)
    const blog = new myMDBlog.blogModel({
      tieude_blog,
      img_blog,
      tieude_khongdau,
      theloai: idtheloai
    })
    theloai.blog.push(blog._id)
    // Thêm các nội dung blog
    if (Array.isArray(content) && Array.isArray(img) && Array.isArray(tieude)) {
      for (let i = 0; i < content.length; i++) {
        const updatedContent = replaceKeywordsWithLinks(
          content[i],
          keywords[i],
          urlBase[i]
        )

        blog.noidung.push({
          content: updatedContent,
          img: img[i],
          tieude: tieude[i],
          keywords: keywords[i],
          urlBase: urlBase[i]
        })
      }
    } else {
      const updatedContent = replaceKeywordsWithLinks(
        content,
        keywords,
        urlBase
      )

      blog.noidung.push({
        content: updatedContent,
        img,
        tieude,
        keywords,
        keywords
      })
    }

    await blog.save()
    await theloai.save()
    res.redirect('/main')
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` })
  }
})
router.post(
  '/postblog2/:idtheloai',
  uploads.fields([
    { name: 'imgblog', maxCount: 1 }, // Một ảnh duy nhất
    { name: 'img', maxCount: 100000 } // Nhiều ảnh (có thể điều chỉnh số lượng tối đa)
  ]),
  async (req, res) => {
    try {
      const { tieude_blog, content, tieude, keywords, urlBase } = req.body
      const idtheloai = req.params.idtheloai
      const theloai = await theloaiblog.theloaiblogModel.findById(idtheloai)
      // Xác định domain
      const domain = 'https://baotech.vn' // Thay đổi thành domain của bạn

      // Lấy tên file ảnh từ req.files và thêm domain vào trước tên file
      const imgblog = req.files['imgblog']
        ? `${domain}/${req.files['imgblog'][0].filename}`
        : null
      const img = req.files['img']
        ? req.files['img'].map(file => `${domain}/${file.filename}`)
        : []

      const tieude_khongdau1 = unicode(tieude_blog)
      const tieude_khongdau = removeSpecialChars(tieude_khongdau1)

      const blog = new myMDBlog.blogModel({
        tieude_blog,
        img_blog: imgblog, // URL ảnh đơn
        tieude_khongdau,
        theloai:idtheloai
      })
      theloai.blog.push(blog._id)

      // Thêm các nội dung blog
      if (
        Array.isArray(content) &&
        Array.isArray(tieude) &&
        Array.isArray(keywords) &&
        Array.isArray(urlBase)
      ) {
        for (let i = 0; i < content.length; i++) {
          const updatedContent = replaceKeywordsWithLinks(
            content[i],
            keywords[i],
            urlBase[i]
          )

          blog.noidung.push({
            content: updatedContent,
            img: img[i] || null, // Sử dụng ảnh từ mảng hoặc null nếu không có
            tieude: tieude[i],
            keywords: keywords[i],
            urlBase: urlBase[i]
          })
        }
      } else {
        const updatedContent = replaceKeywordsWithLinks(
          content,
          keywords,
          urlBase
        )

        blog.noidung.push({
          content: updatedContent,
          img: img[0] || null, // Nếu chỉ có một ảnh, chọn ảnh đầu tiên hoặc null
          tieude,
          keywords,
          urlBase
        })
      }

      await blog.save()
      await theloai.save()
      res.redirect('/main')
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` })
    }
  }
)

router.get('/getaddblog/:idtheloai', async (req, res) => {
  const idtheloai = req.params.idtheloai
  res.render('home/addblog.ejs', { idtheloai })
})

router.get('/editblog/:idblog', async (req, res) => {
  try {
    const idblog = req.params.idblog
    const blogg = await myMDBlog.blogModel.findById(idblog)

    // Hàm để loại bỏ tất cả các thẻ <a> khỏi nội dung
    function removeAllLinks (content) {
      // Biểu thức chính quy để tìm và loại bỏ tất cả các thẻ <a> cùng với nội dung của chúng
      return content.replace(/<a[^>]*>(.*?)<\/a>/gi, '$1')
    }

    const blog = blogg.noidung.map(bl => {
      return {
        content: removeAllLinks(bl.content),
        img: bl.img,
        tieude: bl.tieude,
        keywords: bl.keywords,
        urlBase: bl.urlBase
      }
    })

    res.render('home/editBlog.ejs', {
      idblog,
      blog,
      tieude_blog: blogg.tieude_blog,
      img_blog: blogg.img_blog
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` })
  }
})

router.post('/editblog/:idblog', async (req, res) => {
  try {
    const { tieude_blog, img_blog, tieude, content, img, keywords, urlBase } =
      req.body
    const idblog = req.params.idblog
    const blog = await myMDBlog.blogModel.findById(idblog)
    blog.tieude_blog = tieude_blog
    blog.img_blog = img_blog
    blog.tieude_khongdau = unicode(tieude_blog)

    if (Array.isArray(content) && Array.isArray(img) && Array.isArray(tieude)) {
      blog.noidung.forEach((nd, index) => {
        if (content[index]) {
          const updatedContent = replaceKeywordsWithLinks(
            content[index],
            keywords[index],
            urlBase[index]
          )
          nd.content = updatedContent
        }
        nd.keywords = keywords[index]
        nd.urlBase = urlBase[index]
        if (img[index]) {
          nd.img = img[index]
        }
        if (tieude[index]) {
          nd.tieude = tieude[index]
        }
      })

      for (let i = blog.noidung.length; i < content.length; i++) {
        const updatedContent = replaceKeywordsWithLinks(
          content[i],
          keywords[i],
          urlBase[i]
        )

        blog.noidung.push({
          content: updatedContent,
          img: img[i],
          tieude: tieude[i],
          keywords: keywords[i],
          urlBase: urlBase[i]
        })
      }
    } else {
      const updatedContent = replaceKeywordsWithLinks(
        content,
        keywords,
        urlBase
      )
      blog.noidung = blog.noidung.slice(0, content.length)

      blog.noidung = blog.noidung.map(nd => {
        nd.content = updatedContent
        nd.img = img
        nd.tieude = tieude
        nd.keywords = keywords
        nd.urlBase = urlBase
        return nd
      })
    }

    await blog.save()
    await theloai.save()
    res.redirect('/main')
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` })
  }
})
router.post('/deleteblog/:idblog', async (req, res) => {
  try {
    const idblog = req.params.idblog
    const blog = await myMDBlog.blogModel.findById(idblog)
    const theloai = await theloaiblog.theloaiblogModel.findById(blog.theloai)
    if (!blog) {
      // Nếu không tìm thấy blog, trả về lỗi 404
      return res.status(404).json({ message: 'Blog không tìm thấy' })
    }

    theloai.blog = theloai.blog.filter(b => b.toString() !== idblog)
    await theloai.save()
    await myMDBlog.blogModel.findByIdAndDelete(idblog)

    res.redirect('/main')
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` })
  }
})
router.get('/test', async (req, res) => {
  res.render('home/test.ejs')
})

module.exports = router
