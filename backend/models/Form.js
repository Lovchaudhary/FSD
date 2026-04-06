const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  studentId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String },
  rollNumber:  { type: String },
  examType:    { type: String, default: 'regular' },
  semester:    { type: Number, default: 1 },
  status:      { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  remarks:     { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Form', FormSchema);
