const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
  sender:  { type: String, enum: ['student','teacher','admin'], required: true },
  message: { type: String, required: true },
  at:      { type: Date, default: Date.now },
});

const TicketSchema = new mongoose.Schema({
  studentId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String },
  title:       { type: String, required: true },
  category:    { type: String, default: 'general' },
  description: { type: String, default: '' },
  priority:    { type: String, enum: ['low','medium','high'], default: 'medium' },
  isAnonymous: { type: Boolean, default: false },
  status:      { type: String, enum: ['open','in-progress','resolved'], default: 'open' },
  replies:     [ReplySchema],
}, { timestamps: true });

module.exports = mongoose.model('Ticket', TicketSchema);
