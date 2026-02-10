const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
      maxlength: 255,
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
      minlength: 10,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
