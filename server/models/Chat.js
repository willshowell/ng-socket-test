var mongoose = require('mongoose');

var ChatSchema = new mongoose.Schema({
  room: String,
  username: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Chat', ChatSchema);