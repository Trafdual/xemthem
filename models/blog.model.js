var db = require('./db');
const blogChema = new db.mongoose.Schema({
    tieude_blog: { type: String, require: true },
    tieude_khongdau:{ type: String, require: true },
    img_blog: { type: String },
    noidung: [{
        tieude: { type: String },
        content: { type: String },
        img: { type: String },
    }],
    contentLink: [
      {
        tieude: { type: String },
        noidung: [
          {
            nd: { type: String },
            a: [
              {
                name: { type: String },
                link: { type: String }
              }
            ],
          }
        ],
        img: {
          type: String
        }
      }
    ]
}, {
    collection: 'Blog'
});

let blogModel = db.mongoose.model('blogModel', blogChema);
module.exports = { blogModel };