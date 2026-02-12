const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true, maxlength: 500 },
  noticeDate: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notice', NoticeSchema);
