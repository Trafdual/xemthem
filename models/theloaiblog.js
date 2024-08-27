var db = require('./db')
const theloaiblogChema = new db.mongoose.Schema(
  {
    name: { type: String, require: true },
    blog:[{type: db.mongoose.Schema.Types.ObjectId, ref: 'Blog'}]
  },
  {
    collection: 'TheLoaiBlog'
  }
)

let theloaiblogModel = db.mongoose.model('theloaiblog', theloaiblogChema)
module.exports = { theloaiblogModel }
