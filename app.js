const express = require('express');
const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
const session = require('express-session');
const morgan = require('morgan');
const numeral = require('numeral');
const cron = require('node-cron');
const moment = require('moment');
const mongoose = require("mongoose");
const dbConfig = require("./config/database.config");

require('express-async-errors');

const app = express();

app.use(morgan('dev'));
//để dùng được form thì cần cái này
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // cookie: {
  //     secure: true
  // }
}))

//dùng thư mục public như cộng cộng mới gọi hình lên được
app.use(express.static('public'));

app.engine('hbs', exphbs({
  defaultLayout: 'main.hbs',
  layoutsDir: 'views/_layouts',
  helpers: {
    section: hbs_sections(),
    format: val => numeral(val).format('0,0'),
  }
}));
app.set('view engine', 'hbs');



//connecting to the database
mongoose.Promise = global.Promise;
mongoose
    .connect(dbConfig.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => {
        console.log("Successfully connected to the database");
    })
    .catch((err) => {
        console.log("Could not connected to the database. Exiting now...", err);
        process.exit();
    });

//2 dòng này là tổng hợp của mấy dòng app.use của local hay route
require('./middlewares/locals.mdw')(app);
require('./middlewares/routes.mdw')(app);

app.get('/', async (req, res) => {
  res.render('home');
})

app.get('/about', (req, res) => {
  res.render('about');
})

app.use((req, res, next) => {
   res.render('vwError/404');
  //res.send('You\'re lost');
})


//
// default error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  console.log(err);
  res.render('vwError/500');
  //res.status(500).send('View error on console.');
})


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
})