var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var compression = require('compression');

require('dotenv').config();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var jpsAdminRouter = require('./routes/jpsadmin');
var adminAuthRouter = require('./routes/adminAuth');
var mongoose = require('mongoose');
var cors = require('cors');
var momentsRouter = require('./routes/moments');
var messagesRouter = require('./routes/messages');
var admissionFormRouter = require('./routes/admissionForm');
var noticesRouter = require('./routes/notices');
var siteSettingsRouter = require('./routes/siteSettings');
const { ensureDefaultSuperAdmin } = require('./middleware/adminAuth');

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
      console.log('MongoDB connected');
      try {
        await ensureDefaultSuperAdmin();
      } catch (error) {
        console.error('Failed to ensure default superadmin:', error.message);
      }
    })
    .catch((err) => console.error('MongoDB error', err));
}

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/jpsadmin9117', jpsAdminRouter);
app.use('/api/admin-auth', adminAuthRouter);
app.use('/api/moments', momentsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/admission-form', admissionFormRouter);
app.use('/api/notices', noticesRouter);
app.use('/api/site-settings', siteSettingsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).json({ error: 'Not Found' });
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send error response
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
