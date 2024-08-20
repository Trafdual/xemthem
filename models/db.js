const mongoose = require('mongoose')
const uri =
  'mongodb+srv://trafdual:trafdual@cluster0.jsm1k.mongodb.net/baominhstore?retryWrites=true&w=majority&appName=Cluster0&appName=Cluster0'
mongoose.connect(uri).catch(err => {
  console.log('Loi ket noi CSDL')
  console.log(err)
})
module.exports = { mongoose }
