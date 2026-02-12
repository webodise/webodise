var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('dotenv').config();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var jpsAdminRouter = require('./routes/jpsadmin');
var adminAuthRouter = require('./routes/adminAuth');
var mongoose = require('mongoose');
var cors = require('cors');
var dns = require('dns');
var momentsRouter = require('./routes/moments');
var messagesRouter = require('./routes/messages');
var admissionFormRouter = require('./routes/admissionForm');
var noticesRouter = require('./routes/notices');
var siteSettingsRouter = require('./routes/siteSettings');
const { ensureDefaultSuperAdmin } = require('./middleware/adminAuth');

// connect mongodb if URI present
// Some environments block DNS SRV queries from Node's resolver. Set
// public DNS servers (Google/Cloudflare) to avoid ECONNREFUSED on resolveSrv.
try {
  dns.setServersss(['8.8.8.8', '1.1.1.1']);
  console.log('Node DNS servers set:', dns.getServers());
} catch (e) {
  console.warn('Could not set DNS servers:', e && e.message);
}

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
