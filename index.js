const express = require('express');
const createError = require('http-errors');
var path = require('path');
var session = require('express-session');
var settingsRouter = require('./routes/settings.route');
var accountsRouter = require('./routes/accounts.route');
var apiAccRouter = require('./routes/acc.api');
var sitmaprouter=require('./routes/sitemap.xml');
var homeRouter = require('./routes/home.route');
var methodOverride = require('method-override');
var bodyParser = require("body-parser");
const { log } = require('console');
const app = express();
const MongoStore = require('connect-mongo');
var db = require('./models/db');
const uri = "mongodb+srv://ducbinhnguyennd:ducbinhnguyennd@cluster0.geuahvt.mongodb.net/AntaoShop?retryWrites=true&w=majority";

const mongoStoreOptions = {
  mongooseConnection: db.mongoose.connection,
  mongoUrl: uri ,
  collection: 'sessions',
};

// app.set('view engine', 'ejs'); 
// view engine setup
app.use(session({
  secret: 'adscascd8saa8sdv87ds78v6dsv87asvdasv8',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create(mongoStoreOptions)
  // ,cookie: { secure: true }
}))



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use('/', homeRouter);
app.use('/api', apiAccRouter);
app.use('/accounts', accountsRouter);
app.use('/', settingsRouter);
app.use('/',sitmaprouter);

// app.use('/test', testRouter);

app.use(express.static(path.join(__dirname, '/public')));


app.use(function (req, res, next) {
  next(createError(404));
});
app.listen(3000, () => {
  console.log('Server is running on port 3000');
  console.log(__dirname);
});
module.exports = app; 