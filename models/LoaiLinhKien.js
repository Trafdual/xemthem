const db = require('./db');

const loailinkkienSchema = new db.mongoose.Schema({
name:{type:String},
thuonghieu:{type:String},
linhkien:[{ type: db.mongoose.Schema.Types.ObjectId, ref: 'linkkien' }]
});

const loailinkkien = db.mongoose.model('loailinkkien', loailinkkienSchema);
module.exports = {loailinkkien};
