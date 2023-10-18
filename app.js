var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var flash = require('express-flash');
var session = require('express-session');
var db=require('./database');
var Mailer = require("nodemailer");
var fetchAssignedBooks = require('./controllers/activityController');
var QRCode = require('qrcode');
 
var app = express();
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
 
app.use(session({ 
    secret: '123456catr',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
 
app.use(flash());
 
/* GET home page. */
app.get('/', function(req, res, next) {
  const url = 'https://www.google.com';
  QRCode.toDataURL(url,{type:'terminal'},
                    function (err, QRcode) {
 
    if(err) return console.log("error occurred")
 
    // Printing the generated code
    console.log(QRcode);
    res.render('contact-us',{title:QRcode});
})
  //res.render('contact-us', { title: QRcode });
 
});
 
app.post('/contact-us', function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var checkin = req.body.checkin;
  var checkout = req.body.checkout;

  var sql = `INSERT INTO contacts (name, email,checkin,checkout, created_at) VALUES ("${name}", "${email}", "${checkin}","${checkout}", NOW())`;
  db.query(sql, function(err, result) {
    if (err) throw err;
    console.log('record inserted');
    req.flash('success', 'Data added successfully!');
    //res.redirect('/');
  });
  var transportar = Mailer.createTransport({
    service: "gmail",
    auth: {
      user: "shampakundu0963@gmail.com", // Your Gmail ID
      pass: "cvwmkgdnrvyfjgrb",         // Your Gmail Password
    },
  });
  
  // Deifne mailing options like Sender Email and Receiver.
  var mailOptions = {
    from: "shampakundu0963@gmail.com", // Sender ID
    to: email, // Reciever ID
    subject: "Hotel Booking", // Mail Subject
    html: "<h1>Welcome "+name+"</h1><p>Your stay is from "+checkin+' to '+checkout+'</p>', 
  };
  
  // Send an Email
  transportar.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
    console.log(info);
  });
  res.redirect('/');
});

app.get("/assigned-activity", fetchAssignedBooks);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
 
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
 
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
 
// port must be set to 3000 because incoming http requests are routed from port 80 to port 8080
// app.listen(3000, function () {
//     console.log('Node app is running on port 3000');
// });
 
module.exports = app;