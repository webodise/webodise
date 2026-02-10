require('dotenv').config();
const mongoose = require('mongoose');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var contactsRouter = require('./routes/contacts');

var app = express();

// MongoDB Connection with detailed logging
if (process.env.MONGODB_URI) {
  console.log('🔄 Connecting to MongoDB...');
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    console.log('📊 Database: webodise');
    console.log('-----------------------------------');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:');
    console.error(err.message);
    console.log('-----------------------------------');
  });
} else {
  console.warn('⚠️ MONGODB_URI not set - running without database');
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// CORS middleware - Allow requests from Vercel and local development
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://localhost:5173',
    'https://webodise.vercel.app',
    'https://www.webodise.vercel.app',
    process.env.FRONTEND_URL || 'http://localhost:3000',
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
    res.header('Access-Control-Allow-Origin', origin || '*');
  } else if (!origin || origin === 'null') {
    res.header('Access-Control-Allow-Origin', '*');
  }
  
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/contacts', contactsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  const status = err.status || 500;
  
  // Check if request expects JSON
  if (req.accepts('json')) {
    return res.status(status).json({
      success: false,
      error: res.locals.message,
      ...(process.env.NODE_ENV === 'development' && { details: res.locals.error })
    });
  }

  // render the error page for HTML requests
  res.status(status);
  res.render('error');
});

module.exports = app;
