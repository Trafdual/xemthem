const mongoose = require('mongoose')
const uri =
  'mongodb+srv://ducbinhnguyennd:ducbinhnguyennd@cluster0.sck9o.mongodb.net/AntaoShop?retryWrites=true&w=majority'
mongoose.connect(uri).catch(err => {
  console.log('Loi ket noi CSDL')
  console.log(err)
})
module.exports = { mongoose }
