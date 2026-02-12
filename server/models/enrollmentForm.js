const mongoose = require('mongoose');

const EnrollmentFormSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, default: 0 },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EnrollmentForm', EnrollmentFormSchema);
