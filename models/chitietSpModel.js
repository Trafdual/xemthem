const db = require('./db');

const chitietspSchema = new db.mongoose.Schema({
    image:{type:String},
    name:{type:String},
    content: { type: String },
    price: { type: String },
    loaisp: { type: String },
    chitiet: [{
        name:{type:String},
        price:{type:String}
    }],
    idloaisp: { type: db.mongoose.Schema.Types.ObjectId, ref: 'loaisp' }
});

const ChitietSp = db.mongoose.model('chitietsp', chitietspSchema);
module.exports = {ChitietSp};
