const db = require('./db');

const notifySchema = new db.mongoose.Schema({
tenkhach:{type:String},
phone:{type:String},
email:{type:String},
tensp:{type:String},
price:{type:String},
idsp:{type: db.mongoose.Schema.Types.ObjectId, ref: 'chitietsp'},
isRead: { type: Boolean, default: false },
});

const notify = db.mongoose.model('notify', notifySchema);
module.exports = {notify};
