const express = require('express')
var path = require('path')
var session = require('express-session')
var apinewsanpham = require('./routes/apinewsanpham')
var settingsRouter = require('./routes/settings.route')
var methodOverride = require('method-override')
var bodyParser = require('body-parser')
const app = express()
const MongoStore = require('connect-mongo')
var db = require('./models/db')
const uri =
  'mongodb+srv://traz08102003:G1XMVWTucFqfpNch@cp17303.4gzmzyt.mongodb.net/baiviet?retryWrites=true&w=majority&appName=CP17303'

const mongoStoreOptions = {
  mongooseConnection: db.mongoose.connection,
  mongoUrl: uri,
  collection: 'sessions'
}

// app.set('view engine', 'ejs');
// view engine setup
app.use(
  session({
    secret: 'adscascd8saa8sdv87ds78v6dsv87asvdasv8',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create(mongoStoreOptions)
    // ,cookie: { secure: true }
  })
)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(methodOverride('_method'))

app.use('/', apinewsanpham)
app.use('/', settingsRouter)


app.use(express.static(path.join(__dirname, '/public')))

app.listen(8080, () => {
  console.log('Server is running on port 8080')
  console.log(__dirname)
})
module.exports = app
