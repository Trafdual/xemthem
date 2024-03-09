const mongoose = require('mongoose');

const tenSpSchema = new mongoose.Schema({
name:{type:String},
chitietsp:[{ type: mongoose.Schema.Types.ObjectId, ref: 'chitietsp' }],
});

const TenSP = mongoose.model('loaisp', tenSpSchema);
module.exports = TenSP;
