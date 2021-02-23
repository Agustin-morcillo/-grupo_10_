/* CONSTANTES */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const logCookie = require('./middlewares/logCookie');
const localSession = require('./middlewares/localSession');
const methodOverride = require('method-override')
const app = express();

/* RUTAS REQUERIDAS */
const mainRouter=require("./routes/main")
const usersRouter=require("./routes/users");
const productRouter=require("./routes/products");
const rutineRouter=require("./routes/rutines");
const apiUsersRouter = require("./routes/api/users/users");
const apiRutinesRouter = require("./routes/api/rutines/rutines");

/* CONFIGURACIONES */
app.use(session({secret: 'energym session', resave: false, saveUninitialized: true}))
app.use(methodOverride('_method'))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//middleware auth session cookie
app.use(logCookie);
app.use(localSession);

/* RUTAS */
app.use("/", mainRouter);
app.use("/users", usersRouter);
app.use("/products", productRouter);
app.use("/rutines", rutineRouter);
app.use("/api/users", apiUsersRouter);
app.use("/api/rutines", apiRutinesRouter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



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

module.exports = app;
