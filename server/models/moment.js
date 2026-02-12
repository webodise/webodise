const mongoose = require('mongoose');

const MomentSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  imagePath: { type: String },
  category: { type: String, enum: ['Events', 'Activities', 'Campus'], default: 'Events' },
  subcategory: { type: String }, // e.g., 'Republic Day', 'Annual Day', 'Independence Day', 'Prize Distribution'
  eventDate: { type: Date }, // date/time of the event
  isTop: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Moment', MomentSchema);




