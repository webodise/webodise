const mongoose = require('mongoose');

const SiteSettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, trim: true, maxlength: 100 },
  value: { type: String, default: '' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', default: null },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SiteSetting', SiteSettingSchema);
