const db = require('./db');

const tenSpSchema = new db.mongoose.Schema({
name:{type:String},
chitietsp:[{ type: db.mongoose.Schema.Types.ObjectId, ref: 'chitietsp' }],
});

const TenSP = db.mongoose.model('loaisp', tenSpSchema);
module.exports = {TenSP};
