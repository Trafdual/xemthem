const db = require('./db');

const linkkienSchema = new db.mongoose.Schema({
name:{type:String},
price:{type:String},
loailinhkien:{ type: db.mongoose.Schema.Types.ObjectId, ref: 'loailinkkien' },
loai:{type:String},
image:{type:String}
});

const linkkien = db.mongoose.model('linkkien', linkkienSchema);
module.exports = {linkkien};
