// models/Message.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String },
  fileUrl: { type: String },
  fileType: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Message || mongoose.model('Message', MessageSchema);
