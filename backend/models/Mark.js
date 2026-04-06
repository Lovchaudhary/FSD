const mongoose = require('mongoose');

const MarkSchema = new mongoose.Schema({
  studentId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rollNumber:  { type: String, required: true },
  teacherId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subject:     { type: String, required: true },
  marks:       { type: Number, required: true },
  maxMarks:    { type: Number, default: 100 },
  examType:    { type: String, enum: ['internal','external','assignment','practical'], default: 'internal' },
  semester:    { type: String, default: '' },
  group:       { type: String, default: '' },
  isFinal:     { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Mark', MarkSchema);
