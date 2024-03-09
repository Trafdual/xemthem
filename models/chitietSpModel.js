const mongoose = require('mongoose');

const chitietspSchema = new mongoose.Schema({
    image:{type:String},
    name:{type:String},
    content: { type: String },
    price: { type: String },
    loaisp: { type: String },
    mausac: [{
        image: { type: String },
        color: { type: String },
        price:{type:String}
    }],
    idloaisp: { type: mongoose.Schema.Types.ObjectId, ref: 'loaisp' }
});

const ChitietSp = mongoose.model('chitietsp', chitietspSchema);
module.exports = ChitietSp;
