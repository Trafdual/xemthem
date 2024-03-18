const db = require('./db');

const linkkienSchema = new db.mongoose.Schema({
name:{type:String},
price:{type:String}
});

const linkkien = db.mongoose.model('loaisp', linkkienSchema);
module.exports = {linkkien};
