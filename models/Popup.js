const mongoose = require('mongoose');

const popupSchema = new mongoose.Schema({
  isEnabled: {
    type: Boolean,
    required: true,
    default: false
  }
});

module.exports = mongoose.model('Popup', popupSchema);
