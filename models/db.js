const mongoose = require('mongoose')
const uri =
  'mongodb+srv://traz08102003:G1XMVWTucFqfpNch@cp17303.4gzmzyt.mongodb.net/baiviet?retryWrites=true&w=majority&appName=CP17303'
mongoose.connect(uri).catch(err => {
  console.log('Loi ket noi CSDL')
  console.log(err)
})
module.exports = { mongoose }
