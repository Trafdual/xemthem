const db = require('./db');

const tenSpSchema = new db.mongoose.Schema({
name:{type:String},
chitietsp:[{ type: db.mongoose.Schema.Types.ObjectId, ref: 'chitietsp' }],
manhinh:{type:String},
chip:{type:String},
ram:{type:String},
dungluong:{type:String},
camera:{type:String},
pinsac:{type:String},
congsac:{type:String},
hang:{type:String},
thongtin:{type:String}
});

const TenSP = db.mongoose.model('loaisp', tenSpSchema);
module.exports = {TenSP};
