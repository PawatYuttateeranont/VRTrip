var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var io = require('socket.io');
var multer = require('multer');

mongoose.connect('mongodb://localhost:9999/loginapp');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');

// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, '/public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
   errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



app.use('/', routes);
app.use('/users', users);

// var storage = multer.diskStorage({
//     destination: function (request, file, callback) {
//         callback(null, './public/uploads');
//     },
//     filename: function (request, file, callback) {
//         console.log(file);
//         callback(null, file.originalname)
//     }
// });

// var storage = multer.diskStorage({ //multers disk storage settings
//     destination: function (req, file, cb) {
//         cb(null, './public/img/');
//     },
//     filename: function (req, file, cb) {
//         var name = 'img';
//         cb(null, name + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
//     }
// });

// var upload = multer({storage: storage}).single('file');

// /** API path that will upload the files */
// app.post('/upload', function(req, res) {
//     upload(req,res,function(err){
//         if(err){
//              res.json({error_code:1,err_desc:err});
//              return;
//         }
//          res.json({error_code:0,err_desc:null});
//     });
// });

// // Set Port
// app.set('port', (process.env.PORT || 3000));

// app.listen(app.get('port'), function(){
// 	console.log('Server started on port '+app.get('port'));
//   console.log('. . . . . . . . . .');
// });

// Socket.io Listen

var port     = process.env.PORT || 80;
var listen = app.listen(port);
var socket = io.listen(listen);

console.log('Server started on port '+ port);